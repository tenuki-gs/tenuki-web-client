import React, {Component} from 'react';

export default class Captures extends Component {
    /*
    Render a list of captured moves. The `captures` property is expected to be
    a list of move objects that have been taken off of the board.
    */

    render() {
        const captures = this.props.captures;

        if (!captures.length) {
            return <div></div>;
        }

        const capturesByStone = new Map;
        for (let move of captures) {
            if (!capturesByStone.has(move.stone)) {
                capturesByStone.set(move.stone, [move]);
            } else {
                capturesByStone.get(move.stone).push(move);
            }
        }

        return (
            <div className="captures">
                Captures
                {Array.from(capturesByStone).map(([stone, moves]) => (
                    <div className="stone" key={stone}>
                        {moves.map(move => (
                            <span
                                className="capture"
                                key={move.dateCreated}>{stone}</span>
                        ))}
                        <span className="count">
                            {moves.length ? moves.length : ""}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
}
