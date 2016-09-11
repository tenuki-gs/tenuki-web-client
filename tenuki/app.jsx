require("./stylesheets/styles.scss");

import React from 'react';
import ReactDOM from 'react-dom';
import Board from './board';

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

ReactDOM.render(
    <Board gameID={gameID} gameRef={gameRef} />,
    document.getElementById('content')
);

console.log("play somewhere else");
