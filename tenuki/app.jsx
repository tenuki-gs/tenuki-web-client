require("./stylesheets/styles.scss");

import React from 'react';
import ReactDOM from 'react-dom';
import Firebase from 'firebase';

import Board from './components/board';
import Game from './components/game';
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

game.onChange(function () {
    ReactDOM.render(
        <Game game={this} onMove={this.addMove} />,
        document.getElementById('content')
    );
});

console.log("play somewhere else");
