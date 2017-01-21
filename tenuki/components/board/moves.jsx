import React, { Component } from 'react';
import Stone from '../stone';

export default class Moves extends Component {
    /*
    Render stones on the board based on the moves list. Moves know their
    coordinates and other information, whereas Stones only have a color.
    */

    render() {
        const {moves} = this.props;

        return <g className="moves">
            {moves.map(({x, y, stone}) => (
                <g
                    key={`move-${x},${y}`}
                    transform={`translate(${x}, ${y})`}>
                    <Stone stone={stone} />
                </g>
            ))}
        </g>;
    }
}
