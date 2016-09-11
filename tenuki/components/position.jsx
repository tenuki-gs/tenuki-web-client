import React, { Component } from 'react';

export default class Position extends Component{
    render () {
        var symbols = [];
        var symbol = '';
        let {x: x, y: y} = this.props;

        if (y == 1) {
            // This is the top of the board.
            if (x == 1) {
                symbol = '┌';
            } else if (x == 19) {
                symbol = '┐';
            } else {
                symbol = '┬';
            }
        } else if (y == 19) {
            // This is the bottom of the board.
            if (x == 1) {
                symbol = '└';
            } else if (x == 19) {
                symbol = '┘';
            } else {
                symbol = '┴';
            }
        } else {
            // This is somewhere in the middle.
            if (x == 1) {
                symbol = '├';
            } else if (x == 19) {
                symbol = '┤';
            } else {
                symbol = '┼';
            }
        }
        symbols.push(symbol);

        if ((x == 4 || x == 10 || x == 16) &&
            (y == 4 || y == 10 || y == 16)) {
            // This is a star point.
            symbols.push('✦');
        }

        if (this.props.move == 'b') {
            symbols.push('⚫');
        } else if (this.props.move == 'w') {
            symbols.push('⚪');
        }

        return (
            <div
                className="position"
                onClick={this.props.onMove.bind(this)}>
                {symbols.map(s => {
                    return <span className="symbol" key={s}>{s}</span>
                })}
            </div>
        );
    }
};
