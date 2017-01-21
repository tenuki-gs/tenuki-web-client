import React, { Component } from 'react';
import Stone from '../stone';
import StarPoint from './starpoint';

export default class Board extends Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(x, y) {
        this.props.onMove({x, y});
    }

    renderStarPoints(width, height) {
        /*
        Return StarPoint components translated to positions calculated
        based on the size of the board.
        */
        const cornerWidth = width < 13 ? 3 : 4;
        const cornerHeight = height < 13 ? 3 : 4;

        // Points is a list of [x, y] coordinates.
        // Initialize it with all the corner points.
        let points = [
            [cornerWidth, cornerHeight],
            [width - cornerWidth + 1, cornerHeight],
            [cornerWidth, height - cornerHeight + 1],
            [width - cornerWidth + 1, height - cornerHeight + 1],
        ];

        // Add a star point in the middle if the board has odd dimensions.
        if (width % 2 == 1 && height % 2 == 1) {
            points.push([Math.ceil(width / 2), Math.ceil(height / 2)]);
        }

        // Add star points between corners if the board is big enough and that
        // dimension is odd.
        if (width > 13 && width % 2 == 1) {
            points.push([Math.ceil(width / 2), cornerHeight]);
            points.push([Math.ceil(width / 2), height - cornerHeight + 1]);
        }
        if (height > 13 && height % 2 == 1) {
            points.push([cornerWidth, Math.ceil(height / 2)]);
            points.push([width - cornerWidth + 1, Math.ceil(height / 2)]);
        }

        return points.map(([x, y]) => (
            <g
                key={`star-point-${x},${y}`}
                transform={`translate(${x}, ${y})`}>
                <StarPoint />
            </g>
        ));
    }

    render() {
        const {width, height} = this.props.board;
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
                    x2={width + 0.5}
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
                    y2={height + 0.5}
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
                    viewBox={[1, 1, width, height].join(' ')}>
                    <rect
                        className="surface"
                        x="1" y="1" width="100%" height="100%" />
                    {lines}
                    {this.renderStarPoints(width, height)}
                    {spaces}
                    {moves}
                </svg>
            </div>
        )
    }
}
