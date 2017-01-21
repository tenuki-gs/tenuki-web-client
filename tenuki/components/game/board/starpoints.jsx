import React, { Component } from 'react';

export default class StarPoints extends Component {
    /* Render SVG star points based on the size of the board. */

    getPoints(width, height) {
        /*
        Return star point coordinates as [x, y] arrays.
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

        return points;
    }

    render() {
        const points = this.getPoints(this.props.width, this.props.height);

        return <g className="star-points">
            {points.map(([x, y]) => (
                <circle
                    className={`star-point`}
                    key={`star-point-${x},${y}`}
                    r=".1" cx={x + .5} cy={y + .5} />
            ))}
        </g>;
    }
}
