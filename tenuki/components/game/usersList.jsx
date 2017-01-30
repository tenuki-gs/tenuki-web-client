import React, { Component } from 'react';

export default class UsersList extends Component {
    renderPlayers() {
        return this.props.players.map((player) => {
            return(
                <li key={player.uid}>
                    <div>ID: {player.uid}</div>
                    <div>Color: {player.color}</div>
                </li>
            )
        });
    }

    renderObservers() {
        return this.props.observers.map((user) => {
            return(
                <li key={user}>
                    <div>ID: {user}</div>
                </li>
            )
        });
    }

    render() {
        return(
            <div>
                <p>Current Players</p>
                <ul>
                    {this.renderPlayers()}
                </ul>
                <p>Current Observers</p>
                <ul>
                    {this.renderObservers()}
                </ul>
            </div>
        )
    }
}
