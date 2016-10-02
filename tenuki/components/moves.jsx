import React, { Component } from 'react';

export default class Moves extends Component{
    constructor(props) {
        super(props);
    }

    render () {
        return <div>{this.props.game.moves.map(move => {
            return (
                <div key={move.dateCreated}>
                    {move.dateCreated} - {move.type} @ {move.x}, {move.y}
                </div>
            );
        })}</div>;
    }
}
