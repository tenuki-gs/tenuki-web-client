import React, { Component } from 'react';

export default class Stone extends Component {
    render() {
        return (
            <circle
                className={`stone ${this.props.stone}`}
                r=".47" cx=".5" cy=".5" />
        );
    }
}
