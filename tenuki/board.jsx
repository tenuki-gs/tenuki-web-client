import React, { Component } from 'react';
import Position from './position';
import Moves from './moves';

export default class Board extends Component{
    constructor(props) {
      super(props);
      this.state = { 
            game: {
                id: this.props.gameID,
                rules: {
                    board: {
                        width: 19,
                        height: 19
                    },
                    scoring: 'japanese'
                },
                players: {},
                moves: {}
            },
            gameRef: this.props.gameRef
        }
    }
    
    componentDidMount () {
        this.state.gameRef.transaction(game => {
            if (game === null) {
                // Create a new game based on the default state.
                return this.state.game;
            }
        });
        this.state.gameRef.on('value', gameSnapshot => {
            var game = gameSnapshot.val();
            if (!game) {
                return;
            }
            this.setState({game: game});
        });
    }

    render () {
        var game = this.state.game;
        var positions = [];
        var moveByPosition = {};

        var turn = 0;
        for (var moveKey in game.moves) {
            var move = game.moves[moveKey];
            moveByPosition[move.x + ',' + move.y] = turn++ % 2 ? 'w' : 'b';
        }

        for (var y = 1; y <= game.rules.board.height; ++y) {
            var row = [];
            for (var x = 1; x <= game.rules.board.width; ++x) {
                row.push(
                    <Position
                        gameRef={this.state.gameRef}
                        key={x + ',' + y}
                        x={x} y={y}
                        move={moveByPosition[x + ',' + y]}
                    />
                )
            }
            positions.push(<div key={y} className="row">{row}</div>);
        }

        return (
            <div className="board">
                <div className="moves">
                    Game ID: {this.state.game.id}
                    <br /><br />
                    <Moves gameRef={this.props.gameRef}/>
                </div>
                <div className="positions">{positions}</div>
            </div>
        );
    }
};
