import React, { Component } from 'react';

export default class StarPoint extends Component {
    render() {
        return (
            <circle
                className={`star-point`}
                r=".1" cx=".5" cy=".5" />
        );
    }
}
