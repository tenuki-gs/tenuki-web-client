import React, { Component } from 'react';
import Stone from '../stone';

export default class Moves extends Component {
    /*
    Render stones on the board based on the moves list. Moves know their
    coordinates and other information, whereas Stones only have a color.
    */

    render() {
        const {moves} = this.props;

        // Figure out what the last move was so it can be marked.
        let lastMove = null;
        for (let move of moves) {
            if (!lastMove || (move.dateCreated > lastMove.dateCreated)) {
                lastMove = move;
            }
        }

        return <g className="moves">
            {moves.map(move => (
                <g
                    className={`move ${move.stone}`}
                    key={`move-${move.x},${move.y}`}
                    transform={`translate(${move.x}, ${move.y})`}>
                    <Stone stone={move.stone} />
                    {lastMove === move
                        ? <circle
                            className="last-move-marker"
                            cx=".5" cy=".5" r=".18" />
                        : null}
                </g>
            ))}
        </g>;
    }
}
