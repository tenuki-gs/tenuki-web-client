import React, { Component } from 'react';
import Position from './position';
import Moves from './moves';
import Board from './board';

export default class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            board: null
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
            <div className="game">
                <Board
                    board={this.state.board}
                    onMove={this.props.game.addMove}
                />
                <div className="moves">
                    Game ID: {this.props.game.id}
                    <br /><br />
                    <Moves game={this.props.game}/>
                </div>
            </div>
        );
    }
};
