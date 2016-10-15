import React, { Component } from 'react';
import Position from './position';
import Surface from './surface';

export default class Board extends Component{
    render() {
        var game = this.props.game;
        var positions = [];
        var moveByPosition = {};

        var turn = 0;
        for (var moveKey in game.moves) {
            var move = game.moves[moveKey];
            moveByPosition[move.x + ',' + move.y] = turn++ % 2 ? 'w' : 'b';
        }

        for (var y = 1; y <= game.rules.board.height; ++y) {
            for (var x = 1; x <= game.rules.board.width; ++x) {
                positions.push({
                        game: this.props.game,
                        onMove: this.props.onMove,
                        key: x + ',' + y,
                        x: x, y: y,
                        move: moveByPosition[x + ',' + y]
                })
            }
        }

        return (
            <div className="surface">
                <svg
                    height="80vh"
                    viewBox="1 1 19 19"
                >
                    <Surface game={this.props.game} positions={positions} onMove={this.props.onMove} />
                </svg>
            </div>
        )
    }
}
