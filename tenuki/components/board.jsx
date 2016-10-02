import React, { Component } from 'react';
import Position from './position';
import Moves from './moves';

export default class Board extends Component{
    constructor(props) {
        super(props);
    }

    render () {
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
                        onMove={this.props.game.addMove}
                        key={x + ',' + y}
                        x={x} y={y}
                        move={moveByPosition[x + ',' + y]}
                    />
                )
            }
            positions.push(<div key={y} className="row">{row}</div>);
        }

        return (
            <div className="board">
                <div className="moves">
                    Game ID: {this.props.game.id}
                    <br /><br />
                    <Moves game={this.props.game}/>
                </div>
                <div className="positions">{positions}</div>
            </div>
        );
    }
};
