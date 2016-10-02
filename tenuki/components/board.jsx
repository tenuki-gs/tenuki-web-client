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
            var row = [];
            for (var x = 1; x <= game.rules.board.width; ++x) {
                row.push(
                    <Position
                        game={this.props.game}
                        onMove={this.props.onMove}
                        key={x + ',' + y}
                        x={x} y={y}
                        move={moveByPosition[x + ',' + y]}
                    />
                )
            }
            positions.push(<div key={y} className="row">{row}</div>);
        }

        return (
            <div className="surface">
                <svg
                    height="80vh"
                    viewBox="0 0 19 19"
                    shapeRendering="crispEdges"
                >
                    <Surface game={this.props.game} />
                </svg>
                <div className="positions">{positions}</div>
            </div>
        )
    }
}
