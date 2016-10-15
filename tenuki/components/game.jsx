import React, { Component } from 'react';
import Position from './position';
import Moves from './moves';
import Board from './board';

export default class Game extends Component{
    render() {
        return (
            <div className="game">
                <Board
                    game={this.props.game}
                    onMove={this.props.onMove}
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
