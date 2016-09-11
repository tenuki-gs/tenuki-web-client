import React, { Component } from 'react';

export default class Moves extends Component{
    constructor(props) {
        super(props);
        this.state = {
            moves: []
        }
    }

    componentDidMount () {
        this.props.gameRef.child('moves').on('child_added', moveSnapshot => {
            var move = moveSnapshot.val();
            move.key = moveSnapshot.key();
            console.log('child_added', move, this.state.moves);
            this.setState({
                moves: this.state.moves.concat([move])
            });
        });
    }

    render () {
        return <div>{this.state.moves.map(move => {
            return (
                <div key={move.key}>
                    {move.dateCreated} - {move.type} @ {move.x}, {move.y}
                </div>
            );
        })}</div>;
    }
}
