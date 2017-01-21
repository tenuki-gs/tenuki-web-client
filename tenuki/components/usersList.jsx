import React, { Component } from 'react';

export default class UsersList extends Component {
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

    displayObservers() {
        return this.props.observers.map((user) => {
            return(
                <li key={user.uid}>
                    <div>ID: {user.uid}</div>
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
                <p>Current Observers</p>
                <ul>
                    {this.displayObservers()}
                </ul>
            </div>
        )
    }
}
