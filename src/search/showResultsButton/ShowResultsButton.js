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
        const stillingerWord = this.props.searchResults && this.props.searchResults.positioncount > 1 ? 'stillinger' : 'stilling';
        const annonserWord = this.props.searchResults && this.props.searchResults.total > 1 ? 'annonser' : 'annonse';

        return (
            <SnapToTop className="ShowResultsButton">
                <div className="ShowResultsButton__inner">
                    <div className="ShowResultsButton__inner__container container">
                        <div className="ShowResultsButton__flex__count">
                            {this.props.searchResults && (
                                this.props.searchResults.total > 0 ?
                                    (
                                        <Element>
                                            {this.props.searchResults.positioncount} <span
                                            className="ShowResultsButton__text"> {stillingerWord} i </span>
                                            {this.props.searchResults.total} <span
                                            className="ShowResultsButton__text"> {annonserWord}</span>
                                        </Element>
                                    ) : (
                                        <Element>
                                            <span className="ShowResultsButton__text">Ingen treff</span>
                                        </Element>
                                    )
                            )}
                        </div>
                        <div>
                            {this.props.searchResults && this.state.showGoToResults && (
                                <a href="#treff" className="Knapp Knapp--mini">
                                    Vis treff
                                </a>
                            )}
                            {this.props.searchResults && this.state.showGoToSearch && (
                                <a href="#top" className="Knapp Knapp--mini">
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
        total: PropTypes.number,
        positioncount: PropTypes.number
    })
};

const mapStateToProps = (state) => ({
    searchResults: state.search.searchResult
});


export default connect(mapStateToProps)(ShowResultsButton);

