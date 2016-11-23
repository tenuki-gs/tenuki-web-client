import React, { Component } from 'react';
import Position from './position';

export default class Board extends Component{
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(x, y) {
        this.props.onMove({x, y});
    }

    render() {
        const width = this.props.board.width;
        const height = this.props.board.height;
        const lines = [];
        const spaces = [];
        const moves = [];

        for (var y = 1.5; y <= height + 0.5; ++y) {
            lines.push(
                <line
                    x1="1.5"
                    y1={y}
                    x2={height + 0.5}
                    y2={y}
                    stroke="black"
                    strokeWidth="0.05"
                />
            )
        }

        for (var x = 1.5; x <= width + 0.5; ++x) {
            lines.push(
                <line
                    x1={x}
                    y1="1.5"
                    x2={x}
                    y2={width + 0.5}
                    stroke="black"
                    strokeWidth="0.1"
                />
            )
        }

        for (var y = 1; y <= height; ++y) {
            for (var x = 1; x <= width; ++x) {
                const position = this.props.board[x][y];

                // Every position has an empty rectangle for detecting hover.
                spaces.push(
                    <rect
                        x={x}
                        y={y}
                        height="1"
                        width="1"
                        onClick={this.onClick.bind(this, x, y)}
                        className="space"
                    />
                )

                if (position.move) {
                    moves.push(
                        <text
                            x={x}
                            y={y}
                            fontSize="1"
                        >{position.move.stone}</text>
                    )
                }
            }
        }

        return (
            <div className="surface">
                <svg
                    height="80vh"
                    viewBox="1 1 19 19"
                >
                    <g>
                        <rect x="1" y="1" width="100%" height="100%" fill="#f6b851"/>
                        {lines}
                        {spaces}
                        {moves}
                    </g>
                </svg>
            </div>
        )
    }
}
