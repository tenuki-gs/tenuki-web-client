import Firebase from 'firebase';

const defaultRules = {
    board: {
        width: 19,
        height: 19
    },
    scoring: 'japanese'
};

// Hook up to our database and initialize it.
const rootRef = new Firebase('https://crackling-heat-815.firebaseio.com/');


function createEmptyBoardState(width, height) {
    /*
    This just initializes a nested object that is like a two-dimensional array,
    but 1-indexed. Since the rows and columns are objects, it should not be
    iterated over with any assumption about ordering.
    */
    let boardState = {width, height};
    for (let x = 1; x <= width; ++x) {
        boardState[x] = {};
        for (let y = 1; y <= height; ++y) {
            boardState[x][y] = {
                x, y,
                move: null,
                marks: []
            };
        }
    }
    return boardState;
}


function getAdjacentPositions(boardState, x, y) {
    const positions = [];
    if (x > 1) {
        positions.push(boardState[x - 1][y]);
    }
    if (x < boardState.width) {
        positions.push(boardState[x + 1][y]);
    }
    if (y > 1) {
        positions.push(boardState[x][y - 1]);
    }
    if (y < boardState.height) {
        positions.push(boardState[x][y + 1]);
    }
    return positions;
}


function getPositionsInGroup(boardState, x, y) {
    /*
    Return all the positions that are part of the same group, starting at
    coordinate (x, y). This uses a breadth-first search and a search-mark.
    */
    let position = boardState[x][y];
    if (!position.move) {
        return [];
    }

    const group = [];
    const positionsToCheck = [position];
    while (position = positionsToCheck.pop()) {
        const {x, y} = position;
        group.push(position);
        position._search_mark = true;

        for (let neighbor of getAdjacentPositions(boardState, x, y)) {
            if (neighbor.move &&
                neighbor.move.stone == position.move.stone &&
                !neighbor._search_mark)
            {
                // This is a move of the same color that has not been checked.
                positionsToCheck.push(neighbor);
            }
        }
    }

    for (position of group) {
        // This search-mark technique means the function is not thread-safe.
        position._search_mark = undefined;
    }
    return group;
}


function getLibertiesOfGroup(boardState, group) {
    /*
    Return all the empty spaces surrounding a group of stones.
    */
    const libertiesByCoordinate = {};
    for (let position of group) {
        const {x, y} = position;
        for (let neighbor of getAdjacentPositions(boardState, x, y)) {
            const key = neighbor.x + ',' + neighbor.y;
            if (!neighbor.move && !libertiesByCoordinate[key]) {
                // This is an empty position that has not been counted.
                libertiesByCoordinate[key] = neighbor;
            }
        }
    }


    const liberties = [];
    for (let key in libertiesByCoordinate) {
        liberties.push(libertiesByCoordinate[key]);
    }
    return liberties;
}


class GoGame {
    constructor(gameID) {
        this.id = gameID;
        this.rules = defaultRules;
        this.callbacks = {
            onNewBoard: [],
        }

        // The board state is 1-indexed. Don't fuck it up.
        this.boardState = createEmptyBoardState(
            this.rules.board.width, this.rules.board.height);
    }

    addMove(move) {
        // Override in concrete class.
    }

    addPlayer(player) {
        // Override in concrete class.
    }

    reduceMove(boardState, move) {
        /*
        Given a board state and a new move, incorporate the move into the new
        board state. This is where game logic, like capturing and ko,
        should occur.
        */
        // TODO: there is a memory-efficiency to be had reusing elements of
        // the previous board state instead of re-initializing, but that's a
        // premature optimization right now. For now, just deep-copy the
        // previous board state.
        let newBoardState = {
            width: boardState.width,
            height: boardState.height
        };

        for (let x = 1; x <= boardState.width; ++x) {
            newBoardState[x] = {};
            for (let y = 1; y <= boardState.height; ++y) {
                const position = Object.assign({}, boardState[x][y]);
                position.group = null;
                position.marks = [];
                newBoardState[x][y] = position;
            }
        }

        // Now we have a fresh board that we can manipulate all we want without
        // changing the previous board state. The first order of business is
        // to add the new move. We'll assume here that something upstream has
        // prevented any illegal moves from making it this far, so place it.
        newBoardState[move.x][move.y].move = move;

        // Detect if this move captures anything.
        const neighbors = getAdjacentPositions(newBoardState, move.x, move.y);
        for (let neighbor of neighbors) {
            // Is this a different player's stone?
            if (neighbor.move && neighbor.move.stone != move.stone) {
                // Check to see if the move is capturing:
                const group = getPositionsInGroup(
                    newBoardState, neighbor.x, neighbor.y);
                if (group.length &&
                    getLibertiesOfGroup(newBoardState, group).length == 0)
                {
                    // The move has captured this group!
                    for (let position of group) {
                        position.move = null;
                        position.marks.push('🔥');
                    }
                }
            }
        }

        return newBoardState;
    }

    onNewBoard(callback) {
        /*
        Add a function to be called any time the game state changes.
        The function is bound such that `this` is the Game object.
        */
        if (this.callbacks.onNewBoard.indexOf(callback) === -1) {
            this.callbacks.onNewBoard.push(callback.bind(this));
        }
        callback.call(this, this.boardState);
    }
}


export class FirebaseGoGame extends GoGame {
    /*
    This class encapsulates a Firebase representation of a go game.
    The interface presented by this class can be consumed by components.
    */

    constructor(gameID) {
        super(gameID);
        this.addMove = this.addMove.bind(this);
        this.addUser = this.addUser.bind(this);

        this.moves = [];
        this.players = [];
        this.observers = [];
        this.newUser = null;
        this.gameRef = rootRef.child('games/' + this.id);
        this.movesRef = this.gameRef.child('moves');
        this.playersRef = this.gameRef.child('players');
        this.observersRef = this.gameRef.child('observers');

        // Create a new game if the current game ID references an empty game
        // and then listen for changes to it.
        this.gameRef.transaction(game => {
            if (!game) {
                // Create a new game based on the default game template.
                return {
                    rules: this.rules
                };
            }
        }, (error, committed, snapshot) => {
            if (!error) {
                // Now that the game is initialized, start waiting for changes.
                this.gameRef.on('value', gameSnapshot => {
                    this.rules = gameSnapshot.val().rules;
                });

                // This gets called every time a move is added to the database.
                // It is guaranteed to be called in order, and will be call
                // for all existing moves when this class is initialized.
                this.movesRef.on('child_added', moveSnapshot => {
                    const move = moveSnapshot.val();

                    // This is just for backward-compatibility and can be
                    // removed later.
                    if (!move.stone) {
                        move.stone = this.moves.length % 2 ? '⚪' : '⚫'
                    }

                    this.moves.push(move);
                    this.boardState = this.reduceMove(this.boardState, move);
                    this.callbacks.onNewBoard.forEach(callback => {
                        callback(this.boardState);
                    });
                });

                this.playersRef.on('child_added', playerSnapshot => {
                    const player = playerSnapshot.val();
                    this.players.push(player);
                    this.callbacks.onNewBoard.forEach(callback => {
                        callback(this.boardState);
                    });
                });

                this.observersRef.on('child_added', observerSnapshot => {
                    const observer = observerSnapshot.val();
                    this.observers.push(observer);
                    this.callbacks.onNewBoard.forEach(callback => {
                        callback(this.boardState);
                    });
                });

                if (this.players.length < 2) {
                    this.addUser(this.newUser, 'player');
                } else {
                    this.addUser(this.newUser, 'observer');
                }

            } else {
                console.error(error);
            }
        });
    }

    addUser(user, userStatus) {
        if (userStatus === 'player') {
            this.playersRef.push({
                uid: user.uid,
                color: 'orange'
            })
        } else if (userStatus === 'observer') {
            this.observersRef.push({
                uid: user.uid
            })
        }
    }

    addMove({x, y}) {
        this.gameRef.child('moves').push({
            x, y,
            stone: this.moves.length % 2 ? '⚪' : '⚫',
            dateCreated: Firebase.ServerValue.TIMESTAMP
        });
    }
}
