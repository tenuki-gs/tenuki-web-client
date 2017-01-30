import Firebase from 'firebase';
import ObservableModel from './observable';


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
    let boardState = {
        width,
        height,
        captures: []
    };

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
    coordinate (x, y). This uses a breadth-first search.
    */
    let position = boardState[x][y];
    if (!position.move) {
        return [];
    }

    const group = [];
    const stone = position.move.stone;
    const isCheckedByCoordinate = {};
    const coordinateKey = p => p.x + ',' + p.y;
    const positionsToCheck = [position];

    while (position = positionsToCheck.pop()) {
        const {x, y} = position;

        // Note that the position is checked so it isn't checked again.
        isCheckedByCoordinate[coordinateKey(position)] = true;

        // Add the position to the group if it has a move that is the same kind
        // of stone as the rest of the group. Expand the search from here.
        if (position.move && position.move.stone == stone) {
            group.push(position);

            // Explore the neighboring positions that haven't been checked.
            for (let neighbor of getAdjacentPositions(boardState, x, y)) {
                if (!isCheckedByCoordinate[coordinateKey(neighbor)]) {
                    positionsToCheck.push(neighbor);
                }
            }
        }
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


class GoGame extends ObservableModel {
    constructor(gameID) {
        super();
        this.id = gameID;
        this.rules = defaultRules;
        this.players = [];
        this.currentPlayer = null;
        this.observers = [];

        // The board state is 1-indexed. Don't fuck it up.
        this.boardState = createEmptyBoardState(
            this.rules.board.width, this.rules.board.height);
    }

    addMove(move) {
        // Override in concrete class.
    }

    getCurrentPlayer(players) {
        return players.filter(player => {
            return player.uid === this.user.uid;
        })[0];
    }

    isItMyTurn() {
        if (this.players.length >= 2) {
            if (this.getCurrentPlayer(this.players)) {
                const myColor = this.getCurrentPlayer(this.players).color
                var isEvenMove = this.moves.length % 2
                if ((!isEvenMove && myColor === '⚫') || (isEvenMove && myColor === '⚪')) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
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
            height: boardState.height,
            captures: boardState.captures,
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
                        if (position.move) {
                            // TODO: There is a bug in the capturing logic that
                            // causes a position to be included in a group
                            // twice under certain circumstances. This results
                            // in a null move and breaks the Capture component.
                            // The check above should not be necessary if the
                            // logic can be fixed.
                            newBoardState.captures.push(position.move);
                        }
                        position.move = null;
                    }
                }
            }
        }

        return newBoardState;
    }
}


export class FirebaseGoGame extends GoGame {
    /*
    This class encapsulates a Firebase representation of a go game.
    The interface presented by this class can be consumed by components.
    */

    constructor(gameID, authData) {
        super(gameID);
        this.addMove = this.addMove.bind(this);
        this.addUser = this.addUser.bind(this);
        this.isNewUser = this.isNewUser.bind(this);
        this.assignColors = this.assignColors.bind(this);

        this.moves = [];
        this.user = authData;
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
                    this.change();
                });

                this.playersRef.on('child_added', playerSnapshot => {
                    const player = playerSnapshot.val();
                    this.players.push(player);
                    this.change();
                });

                this.playersRef.on('child_changed', playerSnapshot => {
                    const updatedPlayer = this.players.find(player => {
                        return player.uid === playerSnapshot.val().uid
                    });

                    updatedPlayer.color = playerSnapshot.val().color;
                    this.change();
                });

                this.observersRef.on('child_added', observerSnapshot => {
                    const observer = observerSnapshot.val();
                    this.observers.push(observer.uid);
                    this.change();
                });

                if (this.players.length === 0 && this.isNewUser(this.user)) {
                    this.addUser(this.user, 'player');
                } else if (this.players.length === 1 && this.isNewUser(this.user)) {
                    this.addUser(this.user, 'player');
                    this.assignColors();
                } else if (this.isNewUser(this.user)){
                    this.addUser(this.user, 'observer');
                }

            } else {
                console.error(error);
            }
        });
    }

    assignColors() {
        if (Math.random() >= 0.5) {
            this.players[0].color = '⚪';
            this.players[1].color = '⚫';
        } else {
            this.players[1].color = '⚪';
            this.players[0].color = '⚫';
        }

        this.players.forEach(player => {
            this.playersRef.child(player.uid).set({
                color: player.color,
                uid: player.uid
            });
        });
    }

    isNewUser(user) {
        let result = true;
        this.players.forEach(player => {
            if (player.uid === user.uid) {
                result = false;
            }
        });
        return result;
    }

    addUser(user, userStatus) {
        if (userStatus === 'player') {
            this.playersRef.child(user.uid).set({
                uid: user.uid,
                color: null
            })
        } else if (userStatus === 'observer') {
            this.observersRef.push({
                uid: user.uid
            })
        }
    }

    addMove({x, y}) {
        if (this.isItMyTurn()) {
            this.gameRef.child('moves').push({
                x, y,
                stone: this.moves.length % 2 ? '⚪' : '⚫',
                dateCreated: Firebase.ServerValue.TIMESTAMP
            });
        }
    }
}
