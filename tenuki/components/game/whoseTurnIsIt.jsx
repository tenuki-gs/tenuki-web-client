import React, { Component } from 'react';

export default class WhoseTurnIsIt extends Component {
    playMessage() {
        if (this.props.isItMyTurn) {
            return 'Your turn. Make it count!'
        } else if (!this.props.isGameOver) {
            return 'Waiting for other player. The Go gods reward patience.'
        } else {
            return;
        }
    }

    render() {
        return(
            <div>
                <p>{this.playMessage()}</p>
            </div>
        )
    }
}
