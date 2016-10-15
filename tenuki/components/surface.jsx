import React, { Component } from 'react';

export default class Surface extends Component{
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick (x, y) {
        this.props.onMove(x, y);
    }

    render() {
        var game = this.props.game;
        const lines = [];
        const spaces = [];

        for (var y = 0; y <= game.rules.board.height; ++y) {
            for (var x = 0; x <= game.rules.board.width; ++x) {
                spaces.push(
                    <rect
                        x={x}
                        y={y}
                        height="1px"
                        width="1px"
                        onClick={this.onClick.bind(this, x, y)}
                        className="space"
                    />
                )
            }
        }

        for (var y = 1.5; y <= game.rules.board.height + 0.5; ++y) {
            lines.push(
                <line
                    x1="1.5"
                    y1={y}
                    x2={game.rules.board.height + 0.5}
                    y2={y}
                    stroke="black"
                    strokeWidth="0.05"
                />
            )
        }

        for (var x = 1.5; x <= game.rules.board.width + 0.5; ++x) {
            lines.push(
                <line
                    x1={x}
                    y1="1.5"
                    x2={x}
                    y2={game.rules.board.width + 0.5}
                    stroke="black"
                    strokeWidth="0.1"
                />
            )
        }


        const positions = this.props.positions;
        var moves = [];

        for (var i = 0; i < positions.length; ++i) {
            if (positions[i].move == 'w') {
                moves.push(
                    <text
                        x={positions[i].x}
                        y={positions[i].y}
                        fontSize="1"
                    >⚪</text>
                )
            } else if (positions[i].move == 'b') {
                moves.push(
                    <text
                        x={positions[i].x}
                        y={positions[i].y}
                        fontSize="1"
                    >⚫</text>
                )
            } else {
                moves.push(
                    <text
                        x={positions[i].x}
                        y={positions[i].y}
                        fontSize="1"
                    > </text>
                )
            }
        }

        return (
            <g>
                <rect x="1" y="1" width="100%" height="100%" fill="#f6b851"/>
                {spaces}
                {lines}
                {moves}
            </g>
        )
    }
}
