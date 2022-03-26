/* eslint-disable react/no-did-update-set-state */
import { Element } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import SnapToTop from '../../common/components/SnapToTop';
import './ShowResultsButton.less';
import CountDown from './CountDown';

class ShowResultsButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showGoToSearch: false,
            showGoToResults: true,
            fadeClassName: ''
        };
    }

    componentDidMount() {
        window.addEventListener('scroll', this.onWindowScroll);
    }

    componentDidUpdate(prevProps) {
        if (this.props.searchResults &&
            prevProps.searchResults &&
            this.props.searchResults.positioncount !== prevProps.searchResults.positioncount) {
            this.clearTimeouts();
            this.setState({
                fadeClassName: 'ShowResultsButton__inner--faded'
            });
            this.timeout1 = setTimeout(() => {
                this.setState({
                    fadeClassName: 'ShowResultsButton__inner--fade-out'
                });
            }, 10);

            this.timeout2 = setTimeout(() => {
                this.setState({
                    fadeClassName: ''
                });
            }, 2010);
        }
    }

    componentWillUnmount() {
        this.clearTimeouts();
        window.removeEventListener('scroll', this.onWindowScroll);
    }

    clearTimeouts() {
        if (this.timeout1) {
            clearTimeout(this.timeout1);
        }
        if (this.timeout2) {
            clearTimeout(this.timeout2);
        }
    }

    onWindowScroll = () => {
        if (this.isSearchResultsVisible() && this.isSearchFormVisible()) {
            this.setState({
                showGoToSearch: false,
                showGoToResults: true
            });
        } else if (this.isSearchFormVisible()) {
            this.setState({
                showGoToSearch: false,
                showGoToResults: true
            });
        } else if (this.isSearchResultsVisible()) {
            this.setState({
                showGoToSearch: true,
                showGoToResults: false
            });
        }
    };

    isSearchFormVisible = () => {
        if (this.searchForm === undefined || this.searchForm === null) {
            this.searchForm = document.getElementById('sok');
        }
        if (this.searchForm && this.searchForm !== null) {
            return this.isElementVisible(this.searchForm);
        }
        return false;
    };

    isSearchResultsVisible = () => {
        if (this.el === undefined || this.el === null) {
            this.el = document.getElementById('treff');
        }
        if (this.el && this.el !== null) {
            return this.isElementVisible(this.el);
        }
        return false;
    };

    isElementVisible = (el) => {
        const rect = el.getBoundingClientRect();
        const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
        return (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
    };

    render() {
        return (!this.props.searchFailed &&
            <SnapToTop className="ShowResultsButton">
                <div className={`ShowResultsButton__inner ${this.state.fadeClassName}`}>
                    <div className="ShowResultsButton__inner__container">
                        <div className="ShowResultsButton__flex__count">
                            {this.props.searchResults && (
                                this.props.searchResults.total.value > 0 ?
                                    (
                                        <CountDown
                                            numberOfPositions={this.props.searchResults.positioncount}
                                            numberOfAds={this.props.searchResults.total.value}
                                        />
                                    ) : (
                                        <Element>
                                            <span className="ShowResultsButton__text">Ingen treff</span>
                                        </Element>
                                    )
                            )}
                        </div>
                        <div>
                            {this.state.showGoToResults && (
                                <a href="#treff" className="ShowResultsButton__knapp">
                                    Vis treff
                                </a>
                            )}
                            {this.state.showGoToSearch && (
                                <a href="#top" className="ShowResultsButton__knapp">
                                    Endre søk
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </SnapToTop>
        );
    }
}

ShowResultsButton.defaultProps = {
    searchResults: undefined
};

ShowResultsButton.propTypes = {
    searchResults: PropTypes.shape({
        value: PropTypes.number,
        positioncount: PropTypes.number
    }),
    searchFailed: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    searchResults: state.search.searchResult,
    searchFailed: state.error.searchFailed
});


export default connect(mapStateToProps)(ShowResultsButton);

