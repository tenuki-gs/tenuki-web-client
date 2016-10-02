import Firebase from 'firebase';

const defaultRules = {
    board: {
        width: 19,
        height: 19
    },
    scoring: 'japanese'
};

export class FirebaseGoGame {
    /*
    This class encapsulates a Firebase representation of a go game.
    The interface presented by this class can be consumed by components.
    */

    constructor(gameRef) {
        this.ref = gameRef;
        this.moves = [];
        this.movesRef = this.ref.child('moves')
        this.callbacks = {
            onChange: [],
        }
        this.addMove = this.addMove.bind(this);

        // Create a new game if the current game ID references an empty game
        // and then listen for changes to it.
        this.ref.transaction(game => {
            if (!game) {
                // Create a new game based on the default game template.
                return {
                    rules: defaultRules
                };
            }
        }, (error, committed, snapshot) => {
            if (!error) {
                // Now that the game is initialized, start waiting for changes.
                this.ref.on('value', gameSnapshot => {
                    this.rules = gameSnapshot.val().rules;
                    this.callbacks.onChange.forEach(callback => {
                        callback()
                    });
                });

                // This gets called every time a move is added to the database.
                // It is guaranteed to be called in order, and will be call
                // for all existing moves when this class is initialized.
                this.movesRef.on('child_added', moveSnapshot => {
                    this.moves.push(moveSnapshot.val());
                    this.callbacks.onChange.forEach(callback => {
                        callback()
                    });
                });
            } else {
                console.error(error);
            }
        });
    }

    addMove({x, y}) {
        this.ref.child('moves').push({
            x, y,
            dateCreated: Firebase.ServerValue.TIMESTAMP
        });
    }

    onChange(callback) {
        /*
        Add a function to be called any time the game state changes.
        The function is bound such that `this` is the Game object.
        */
        if (this.callbacks.onChange.indexOf(callback) === -1) {
            this.callbacks.onChange.push(callback.bind(this));
        }
    }
}
