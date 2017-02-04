import React, { Component } from 'react';
import Captures from './captures';
import Board from './board';
import UsersList from './usersList';
import WhoseTurnIsIt from './whoseTurnIsIt';

export default class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            board: null,
            players: [],
            theme: 'default'
        };
    }

    componentDidMount() {
        // Listen for changes to the board.
        this.props.game.onChange(game => this.setState({
            board: game.boardState
        }));
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
                    isItMyTurn={this.props.game.isItMyTurn()}
                    onMove={this.props.game.addMove}
                />

                <div className="info">
                    <div>Game ID: {this.props.game.id}</div>
                    <UsersList players={this.props.game.players} observers={this.props.game.observers} />
                    <WhoseTurnIsIt players={this.props.game.players} isItMyTurn={this.props.game.isItMyTurn()} isGameOver={this.props.game.isGameOver()} />
                    <div>
                        <label>Theme: </label>
                        <select onChange={event => {
                                this.setState({theme: event.target.value});
                        }}>
                            <option value="default">Default</option>
                            <option value="black-and-white">Black And White</option>
                        </select>
                    </div>

                    <div>
                        <button disabled={this.props.game.isItMyTurn() ? false : true} onClick={this.props.game.isItMyTurn ? this.props.game.pass : null}>Pass</button>
                        <div>{this.props.game.passMessage()}</div>
                    </div>

                    <Captures captures={this.state.board.captures} />
                </div>

            </div>
        );
    }
};
