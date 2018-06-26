import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Spinner from 'nav-frontend-spinner';
import './Loading.less';

export default class Loading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            faded: true,
            showSpinner: false
        };
    }

    componentDidMount() {
        this.loadingTimeout = setTimeout(() => {
            this.setState({
                faded: false
            });
        }, 250);

        this.spinnerTimeout = setTimeout(() => {
            this.setState({
                showSpinner: true
            });
        }, 1000);
    }

    componentWillUnmount() {
        clearTimeout(this.loadingTimeout);
        clearTimeout(this.spinnerTimeout);
    }

    render() {
        return (
            <div
                className={
                    classNames('Loading', {
                        'Loading--faded': this.state.faded
                    })
                }
            >
                {this.state.showSpinner && this.props.spinner && (
                    <div className="Loading__spinner">
                        <Spinner type="XL" />
                    </div>
                )}
                <div className="Loading__header" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__header" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__list">
                    <div className="Loading__list-item" />
                    <div className="Loading__list-item" />
                    <div className="Loading__list-item" />
                    <div className="Loading__list-item" />
                    <div className="Loading__list-item" />
                </div>
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__header" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__list">
                    <div className="Loading__list-item" />
                    <div className="Loading__list-item" />
                    <div className="Loading__list-item" />
                    <div className="Loading__list-item" />
                    <div className="Loading__list-item" />
                </div>
                <div className="Loading__header" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__header" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__text" />
                <div className="Loading__text" />
            </div>
        );
    }
}

Loading.defaultProps = {
    spinner: true
};

Loading.propTypes = {
    spinner: PropTypes.bool
};
