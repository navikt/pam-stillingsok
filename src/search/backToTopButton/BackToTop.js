import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Chevron from 'nav-frontend-chevron';
import './BackToTop.less';

class BackToTop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showGoToSearch: false,
            showGoToResults: true
        };
    }

    componentDidMount() {
        window.addEventListener('scroll', this.onWindowScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onWindowScroll);
    }

    onWindowScroll = () => {
        if (this.isSearchResultsVisible() && this.isSearchFormVisible()) {
            this.setState({
                showGoToSearch: false,
                showGoToResults: false
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
        if (this.searchForm === undefined) {
            this.searchForm = document.getElementById('SearchForm');
        }
        return this.isElementVisible(this.searchForm);
    };

    isSearchResultsVisible = () => {
        if (this.searchResults === undefined) {
            this.searchResults = document.getElementById('SearchResults');
        }
        return this.isElementVisible(this.searchResults);
    };

    isElementVisible = (el) => {
        const rect = el.getBoundingClientRect();
        const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
        return (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
    };

    render() {
        if (this.props.isAtLeastOneSearchDone) {
            if (this.state.showGoToResults) {
                return (
                    <div className="BackToTop BackToTop--fixed-bottom">
                        <a
                            href="#SearchResults"
                            className="knapp knapp--mini knapp--standard"
                        >
                            <Chevron className="BackToTop__chevron" type="ned" />
                            {this.props.count > 0 ? (
                                <span>Vis {this.props.count} treff</span>
                            ) : (
                                <span>Ingen treff</span>
                            )}
                        </a>
                    </div>
                );
            } else if (this.state.showGoToSearch) {
                return (
                    <div className="BackToTop">
                        <a
                            href="#SearchForm"
                            className="knapp knapp--mini knapp--standard"
                        >
                            <Chevron className="BackToTop__chevron" type="opp" />
                            Endre søk
                        </a>
                    </div>
                );
            }
            return null;
        }
        return null;
    }
}

BackToTop.propTypes = {
    count: PropTypes.number.isRequired,
    isAtLeastOneSearchDone: PropTypes.bool.isRequired
};

BackToTop.propTypes = {
    isAtLeastOneSearchDone: PropTypes.bool.isRequired,
    count: PropTypes.number.isRequired
};

const mapStateToProps = (state) => ({
    isAtLeastOneSearchDone: state.search.isAtLeastOneSearchDone,
    count: state.search.searchResult.total
});


export default connect(mapStateToProps)(BackToTop);

