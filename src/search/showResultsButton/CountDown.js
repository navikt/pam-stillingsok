import { Element } from 'nav-frontend-typografi';
import React from 'react';
import PropTypes from 'prop-types';

const COUNT_UPWARDS = 1;
const COUNT_DOWNWARDS = -1;

class CountDown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: props.numberOfPositions
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.numberOfPositions !== prevProps.numberOfPositions) {
            if (this.interval) {
                clearInterval(this.interval);
            }
            const prevNumberOfPositions = prevProps.numberOfPositions || 0;
            const { numberOfPositions } = this.props;

            const diff = Math.abs(numberOfPositions - prevNumberOfPositions);
            const countDirection = prevNumberOfPositions < numberOfPositions ? COUNT_UPWARDS : COUNT_DOWNWARDS;
            const countBy = Math.ceil(diff / 10) * countDirection;

            this.interval = setInterval(() => {
                const nextCount = this.state.count + countBy;
                if ((countDirection === COUNT_UPWARDS && nextCount >= numberOfPositions)
                    || (countDirection === COUNT_DOWNWARDS && nextCount <= numberOfPositions)) {
                    this.setState({
                        count: numberOfPositions
                    });
                    clearInterval(this.interval);
                } else {
                    this.setState({
                        count: nextCount
                    });
                }
            }, 75);
        }
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    render() {
        return (
            <Element>
                {this.state.count} {' '}
                <span className="ShowResultsButton__text">
                    {this.props.numberOfPositions > 1 ? 'stillinger' : 'stilling'} i {' '}
                </span>
                {this.props.numberOfAds} {' '}
                <span className="ShowResultsButton__text">
                    {this.props.numberOfAds > 1 ? 'annonser' : 'annonse'}
                </span>
            </Element>
        );
    }
}

CountDown.propTypes = {
    numberOfPositions: PropTypes.number.isRequired,
    numberOfAds: PropTypes.number.isRequired
};

export default CountDown;
