import React, { Component } from 'react';

export default class PlayersList extends Component {
    displayPlayers() {
        return this.props.players.map((player) => {
            return(
                <li key={player.uid}>
                    <div>ID: {player.uid}</div>
                    <div>Color: {player.color}</div>
                </li>
            )
        });
    }

    render() {
        return(
            <div>
                <p>Current Players</p>
                <ul>
                    {this.displayPlayers()}
                </ul>
            </div>
        )
    }
}
