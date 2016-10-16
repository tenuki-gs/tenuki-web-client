import React, { Component } from 'react';
import Position from './position';
import Surface from './surface';

export default class Board extends Component{
    render () {
        return (
            <div className="surface">
                <svg
                    height="80vh"
                    viewBox="1 1 19 19"
                >
                    <Surface
                        board={this.props.board}
                        onMove={this.props.onMove} />
                </svg>
            </div>
        )
    }
}
