import React, { Component } from 'react';

export default class Lines extends Component {
    /* Render SVG lines based on the size of the board. */

    render() {
        const {width, height} = this.props;

        const lines = [];
        for (let x = 1.5; x <= width + 0.5; ++x) {
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
        for (let y = 1.5; y <= height + 0.5; ++y) {
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

        return <g className="lines">{lines}</g>;
    }
}
