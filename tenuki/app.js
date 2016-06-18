require("./stylesheets/styles.scss");

import React from 'react';
import ReactDOM from 'react-dom';
var Firebase = require('firebase');

// Hook up to our database and initialize it.
var rootRef = new Firebase('https://crackling-heat-815.firebaseio.com/');

// Listen to a particular game.
var gameID;
if (document.location.hash) {
    gameID = document.location.hash.replace(/^#\//, '');
} else {
    gameID = Math.random() * 100000000000000000;
    document.location = '#/' + gameID;
}
var gameRef = rootRef.child('games/' + gameID);

var Moves = React.createClass({
    getInitialState: function () {
        return {moves: []};
    },
    componentDidMount: function () {
        gameRef.child('moves').on('child_added', moveSnapshot => {
            var move = moveSnapshot.val();
            move.key = moveSnapshot.key();
            console.log('child_added', move, this.state.moves);
            this.setState({
                moves: this.state.moves.concat([move])
            });
        });
    },
    render: function () {
        return <div>{this.state.moves.map(move => {
            return (
                <div key={move.key}>
                    {move.dateCreated} - {move.type} @ {move.x}, {move.y}
                </div>
            );
        })}</div>;
    }
})

// Let's create a board.
var Position = React.createClass({
    handleClick: function () {
        console.log('click', this.props);

        gameRef.child('moves').push({
            dateCreated: Firebase.ServerValue.TIMESTAMP,
            type: 'click',
            x: this.props.x,
            y: this.props.y
        });
    },
    render: function () {
        var symbols = [];
        var symbol = '';
        let {x: x, y: y} = this.props;

        if (y == 1) {
            // This is the top of the board.
            if (x == 1) {
                symbol = '┌';
            } else if (x == 19) {
                symbol = '┐';
            } else {
                symbol = '┬';
            }
        } else if (y == 19) {
            // This is the bottom of the board.
            if (x == 1) {
                symbol = '└';
            } else if (x == 19) {
                symbol = '┘';
            } else {
                symbol = '┴';
            }
        } else {
            // This is somewhere in the middle.
            if (x == 1) {
                symbol = '├';
            } else if (x == 19) {
                symbol = '┤';
            } else {
                symbol = '┼';
            }
        }
        symbols.push(symbol);

        if ((x == 4 || x == 10 || x == 16) &&
            (y == 4 || y == 10 || y == 16)) {
            // This is a star point.
            symbols.push('✦');
        }

        if (this.props.move == 'b') {
            symbols.push('⚫');
        } else if (this.props.move == 'w') {
            symbols.push('⚪');
        }

        return (
            <div
                className="position"
                onClick={this.handleClick}>
                {symbols.map(s => {
                    return <span className="symbol" key={s}>{s}</span>
                })}
            </div>
        );
    }
});


var Board = React.createClass({
    getInitialState: function () {
        return {
            game: {
                id: gameID,
                rules: {
                    board: {
                        width: 19,
                        height: 19
                    },
                    scoring: 'japanese'
                },
                players: {},
                moves: {}
            }
        };
    },
    componentDidMount: function () {
        gameRef.transaction(game => {
            if (game === null) {
                // Create a new game based on the default state.
                return this.state.game;
            }
        });
        gameRef.on('value', gameSnapshot => {
            var game = gameSnapshot.val();
            if (!game) {
                return;
            }
            this.setState({game: game});
        });
    },
    render: function () {
        var game = this.state.game;
        var positions = [];
        var moveByPosition = {};

        var turn = 0;
        for (var moveKey in game.moves) {
            var move = game.moves[moveKey];
            moveByPosition[move.x + ',' + move.y] = turn++ % 2 ? 'w' : 'b';
        }

        for (var y = 1; y <= game.rules.board.height; ++y) {
            var row = [];
            for (var x = 1; x <= game.rules.board.width; ++x) {
                row.push(
                    <Position
                        key={x + ',' + y}
                        x={x} y={y}
                        move={moveByPosition[x + ',' + y]}
                    />
                )
            }
            positions.push(<div key={y} className="row">{row}</div>);
        }

        return (
            <div className="board">
                <div className="moves">
                    Game ID: {this.state.game.id}
                    <br /><br />
                    <Moves />
                </div>
                <div className="positions">{positions}</div>
            </div>
        );
    }
});

// Put the board into the world.
ReactDOM.render(
    <Board />,
    document.getElementById('content')
);

console.log("play somewhere else");
