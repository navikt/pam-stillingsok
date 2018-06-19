import React from 'react';
import PropTypes from 'prop-types';
import Spinner from 'nav-frontend-spinner';
import './Loading.less';

export default class Loading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
    }

    componentDidMount() {
        this.timeout = setTimeout(() => {
            this.setState({
                show: true
            });
        }, 1000);
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    render() {
        return (
            <div className="Loading panel panel--padding">
                {this.state.show && this.props.spinner && (
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
