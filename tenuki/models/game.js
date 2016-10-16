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
                group: null,
                libertyOfGroup: null
            };
        }
    }
    return boardState;
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
            width: this.rules.board.width,
            height: this.rules.board.height
        };

        for (let x = 1; x <= this.rules.board.width; ++x) {
            newBoardState[x] = {};
            for (let y = 1; y <= this.rules.board.height; ++y) {
                newBoardState[x][y] = Object.assign({}, boardState[x][y]);
            }
        }

        // Now we have a fresh board that we can manipulate all we want without
        // changing the previous board state. The first order of business is
        // to add the new move. We'll assume here that something upstream has
        // prevented any illegal moves from making it this far, so place it.
        newBoardState[move.x][move.y].move = move;

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

        this.moves = [];
        this.gameRef = rootRef.child('games/' + this.id);
        this.movesRef = this.gameRef.child('moves');

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
            } else {
                console.error(error);
            }
        });
    }

    addMove({x, y}) {
        this.gameRef.child('moves').push({
            x, y,
            stone: this.moves.length % 2 ? '⚪' : '⚫',
            dateCreated: Firebase.ServerValue.TIMESTAMP
        });
    }
}
