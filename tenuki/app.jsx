require("./stylesheets/styles.scss");

import React from 'react';
import ReactDOM from 'react-dom';

import {getCurrentUser} from './modules/authentication';

import Game from './components/game';
import {FirebaseGoGame} from './models/game';

// Listen to a particular game.
var gameID;
if (document.location.hash) {
    gameID = document.location.hash.replace(/^#\//, '');
} else {
    gameID = Math.random() * 100000000000000000;
    document.location = '#/' + gameID;
}

// Authenticate a user.
let success = (authData) => {
    let game = new FirebaseGoGame(gameID, authData);

    ReactDOM.render(
        <Game game={game} />,
        document.getElementById('content')
    );

    console.log("play somewhere else");
}

let error = (errorData) => {
    console.log('error: ', errorData);
}

getCurrentUser(success, error);



