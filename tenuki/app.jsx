require("./stylesheets/styles.scss");

import React from 'react';
import ReactDOM from 'react-dom';

import {getCurrentUser} from './modules/authentication';

import Game from './components/game';
import {FirebaseGoGame} from './models/game';

// Authenticate a user.
let user = getCurrentUser();

// Listen to a particular game.
var gameID;
if (document.location.hash) {
    gameID = document.location.hash.replace(/^#\//, '');
} else {
    gameID = Math.random() * 100000000000000000;
    document.location = '#/' + gameID;
}

let game = new FirebaseGoGame(gameID);

ReactDOM.render(
    <Game game={game} />,
    document.getElementById('content')
);

console.log("play somewhere else");
