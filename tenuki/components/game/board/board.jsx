import React, { Component } from 'react';
import Lines from './lines';
import Moves from './moves';
import StarPoints from './starpoints';

export default class Board extends Component {
    render() {
        const {width, height} = this.props.board;
        const spaces = [];
        const moves = [];

        for (let y = 1; y <= height; ++y) {
            for (let x = 1; x <= width; ++x) {
                const position = this.props.board[x][y];

                if (position.move) {
                    moves.push(position.move);
                } else {
                    // Every position has an empty rectangle for detecting hover.
                    spaces.push(
                        <rect
                            key={`space-${x},${y}`}
                            x={x}
                            y={y}
                            height="1"
                            width="1"
                            onClick={this.props.isItMyTurn ? this.props.onMove.bind(null, {x, y}) : null}
                            className="space"
                        />
                    )
                }
            }
        }

        return (
            <div className={this.props.isItMyTurn ? "playable board" : "board"}>
                <svg
                    viewBox={[1, 1, width, height].join(' ')}>
                    <rect
                        className="surface"
                        x="1" y="1" width="100%" height="100%" />
                    <Lines width={width} height={height} />
                    <StarPoints width={width} height={height} />
                    <Moves moves={moves} />
                    {spaces}
                </svg>
            </div>
        )
    }
}
