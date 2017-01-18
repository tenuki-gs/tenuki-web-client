import React, { Component } from 'react';
import Position from './position';
import Moves from './moves';
import Board from './board';
import PlayersList from './playersList';

export default class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            board: null,
            players: [{uid: 1234, color: '⚪'}, {uid: 5678, color: '⚫'}],
            theme: 'default'
        };
    }

    componentDidMount() {
        // Listen for changes to the board.
        this.props.game.onNewBoard(board => this.setState({board}));
    }

    render() {
        if (!this.state.board) {
            // The board might be empty until the game initializes.
            return null;
        }

        return (
            <div className={'game theme-' + this.state.theme}>
                <Board
                    board={this.state.board}
                    onMove={this.props.game.addMove}
                />

                <div className="info">
                    <div>Game ID: {this.props.game.id}</div>
                    <PlayersList players={this.state.players} />
                    <div>
                        <label>Theme: </label>
                        <select onChange={event => {
                                this.setState({theme: event.target.value});
                        }}>
                            <option value="default">Default</option>
                            <option value="black-and-white">Black And White</option>
                        </select>
                    </div>
                </div>
            </div>
        );
    }
};
