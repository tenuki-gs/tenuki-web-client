import React, { Component } from 'react';

export default class Surface extends Component{
    render() {
        var game = this.props.game;
        const lines = [];

        for (var y = 0.5; y < game.rules.board.height; ++y) {
            lines.push(
                <line
                    x1="0.5"
                    y1={y}
                    x2={game.rules.board.height - 0.5}
                    y2={y}
                    stroke="black"
                    strokeWidth="0.1"
                />
            )
        }

        for (var x = 0.5; x < game.rules.board.width; ++x) {
            lines.push(
                <line
                    x1={x}
                    y1="0.5"
                    x2={x}
                    y2={game.rules.board.width - 0.5}
                    stroke="black"
                    strokeWidth="0.1"
                />
            )
        }

        return (
            <g>
                <rect x="0" y="0" width="100%" height="100%" fill="#f6b851"/>    
                {lines}
            </g>
        )
    }
}
