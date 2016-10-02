require("./stylesheets/styles.scss");

import React from 'react';
import ReactDOM from 'react-dom';
import Game from './components/game';

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
var game = {
    id: gameID,
    rules: {
        board: {
            width: 19,
            height: 19       
        },
        scoring: 'japanese'
    },
    players: {},
    moves: []
};

gameRef.transaction(game => {
    if (game === null) {
        // Create a new game based on the default state.
        return game;
    }
});

gameRef.on('value', gameSnapshot => {
    var game = gameSnapshot.val();
    if (!game) {
        return;
    }
});

var moves = [];
gameRef.child('moves').on('child_added', moveSnapshot => {
    var move = moveSnapshot.val();
    move.key = moveSnapshot.key();
    console.log('child_added', move, moves);
    game.moves = game.moves.concat([move])
    ReactDOM.render(
        <Game game={game} onMove={onMove} />,
        document.getElementById('content')
    );
});

function onMove () {
    console.log('click', this);

    gameRef.child('moves').push({
        dateCreated: Firebase.ServerValue.TIMESTAMP,
        type: 'click',
        x: this.x,
        y: this.y 
    });
}

ReactDOM.render(
    <Game game={game} onMove={onMove} />,
    document.getElementById('content')
);

console.log("play somewhere else");
