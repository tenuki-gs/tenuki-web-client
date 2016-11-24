import React, { Component } from 'react';
import Stone from './stone';

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
                    key={`row-${y}`}
                    className="gridline row"
                    x1="1.5"
                    y1={y}
                    x2={height + 0.5}
                    y2={y}
                />
            )
        }

        for (var x = 1.5; x <= width + 0.5; ++x) {
            lines.push(
                <line
                    key={`column-${x}`}
                    className="gridline column"
                    x1={x}
                    y1="1.5"
                    x2={x}
                    y2={width + 0.5}
                />
            )
        }

        for (var y = 1; y <= height; ++y) {
            for (var x = 1; x <= width; ++x) {
                const position = this.props.board[x][y];

                if (position.move) {
                    moves.push(
                        <g
                            key={`stone-${x},${y}`}
                            transform={`translate(${x}, ${y})`}>
                            <Stone stone={position.move.stone} />
                        </g>
                    )
                } else {
                    // Every position has an empty rectangle for detecting hover.
                    spaces.push(
                        <rect
                            key={`space-${x},${y}`}
                            x={x}
                            y={y}
                            height="1"
                            width="1"
                            onClick={this.onClick.bind(this, x, y)}
                            className="space"
                        />
                    )
                }
            }
        }

        return (
            <div className="board">
                <svg
                    viewBox="1 1 19 19">
                    <rect
                        className="surface"
                        x="1" y="1" width="100%" height="100%" />
                    {lines}
                    {spaces}
                    {moves}
                </svg>
            </div>
        )
    }
}
