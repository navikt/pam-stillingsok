import { Element } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import SnapToTop from '../../common/SnapToTop';
import './ShowResultsButton.less';

class ShowResultsButton extends React.Component {
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
        return (
            <SnapToTop className="ShowResultsButton">
                <div className="ShowResultsButton__flex container">
                    <div className="ShowResultsButton__flex__count">
                        {this.props.searchResults && (
                            <Element>
                                {this.props.searchResults.total > 0 ?
                                    `${this.props.searchResults.total} treff` :
                                    'Ingen treff'}
                            </Element>
                        )}
                    </div>
                    <div>
                        {this.props.searchResults && this.state.showGoToResults && (
                            <a href="#treff" className="knapp knapp--hoved knapp--mini">
                                Vis treff
                            </a>
                        )}
                        {this.props.searchResults && this.state.showGoToSearch && (
                            <a href="#top" className="knapp knapp--hoved knapp--mini">
                                Endre søk
                            </a>
                        )}
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
        total: PropTypes.number
    })
};

const mapStateToProps = (state) => ({
    searchResults: state.search.searchResult
});


export default connect(mapStateToProps)(ShowResultsButton);

