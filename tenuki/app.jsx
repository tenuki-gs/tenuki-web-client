require("./stylesheets/styles.scss");

import React from 'react';
import ReactDOM from 'react-dom';
import Firebase from 'firebase';

import Board from './components/board';
import {FirebaseGoGame} from './models/game';

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

let game = new FirebaseGoGame(gameRef);

function renderGame() {
}
game.onChange(function () {
    ReactDOM.render(
        <Board game={this} />,
        document.getElementById('content')
    );
});
//renderGame();

console.log("play somewhere else");
