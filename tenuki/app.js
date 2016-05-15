require("./stylesheets/styles.scss");

import React from 'react';
import ReactDOM from 'react-dom';
var Firebase = require('firebase');

// Hook up to our database and initialize it.
var db = new Firebase('https://crackling-heat-815.firebaseio.com/');
var gamesRef = db.child('games');

// Listen to a particular game.
var gameID = 'dev';
var gameRef = gamesRef.child(gameID)

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
        return (
            <div
                className="position"
                onClick={this.handleClick}>
               {this.props.x}, {this.props.y}
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
    componentDidMove: function () {
        gameRef.on('value', function (gameSnapshot) {
            var game = gameSnapshot.val();

            if (game === null) {
                // Create a new game.
                game = this.state.game;
                gameRef.set(game);
            }

            this.setState({game: game})
        });
    },
    render: function () {
        var game = this.state.game;
        var positions = [];

        for (var y = 0; y < game.rules.board.height; ++y) {
            var row = [];
            for (var x = 0; x < game.rules.board.width; ++x) {
                row.push(
                    <Position
                        key={x + ':' + y}
                        x={x + 1}
                        y={y + 1}
                    />
                )
            }
            positions.push(<div key={y} className="row">{row}</div>);
        }

        return (
            <div className="board">
                <div className="moves"><Moves /></div>
                {positions}
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
