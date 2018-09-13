import { Column, Container, Row } from 'nav-frontend-grid';
import { Sidetittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Disclaimer from '../discalimer/Disclaimer';
import FavoriteAlertStripe from '../favorites/FavoriteAlertStripe';
import FavoriteError from '../favorites/FavoriteError';
import { FETCH_FAVORITES } from '../favorites/favoritesReducer';
import BackToTop from './backToTopButton/BackToTop';
import SearchError from './error/SearchError';
import Counties from './facets/counties/Counties';
import EngagementType from './facets/engagement/Engagement';
import Extent from './facets/extent/Extent';
import Occupations from './facets/occupations/Occupations';
import Published from './facets/published/Published';
import Sector from './facets/sector/Sector';
import DelayedSpinner from './loading/DelayedSpinner';
import RestoreScroll from './RestoreScroll';
import './Search.less';
import SearchBox from './searchBox/SearchBox';
import { INITIAL_SEARCH, REMEMBER_SEARCH, RESTORE_PREVIOUS_SEARCH, SEARCH } from './searchReducer';
import SearchResults from './searchResults/SearchResults';
import Sorting from './sorting/Sorting';
import ViewMode from './viewMode/ViewMode';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.props.restorePreviousSearch();
        this.props.initialSearch();
    }

    componentDidMount() {
        this.props.fetchFavorites();
        document.title = 'Ledige stillinger';
    }

    componentWillUnmount() {
        this.props.rememberSearch();
    }

    onSearchFormSubmit = (e) => {
        e.preventDefault();
        this.props.search();
    };

    render() {
        return (
            <div className="Search">
                <Disclaimer />
                <FavoriteAlertStripe />
                <FavoriteError />
                <div className="Search__header">
                    <Container>
                        <Row>
                            <Column xs="12" md="6">
                                <Sidetittel className="Search__header__title">Ledige stillinger</Sidetittel>
                            </Column>
                            <Column xs="12" md="6">
                                <div className="Search__header__right">
                                    <Link className="knapp knapp--mini" to="/favoritter">
                                        Favoritter {!this.props.isFetchingFavorites ? ` (${this.props.favorites.length})` : ''}
                                    </Link>
                                </div>
                            </Column>
                        </Row>
                    </Container>
                </div>
                <Container className="Search__main">
                    {this.props.hasError && (
                        <SearchError />
                    )}
                    {!this.props.hasError && !this.props.initialSearchDone && (
                        <div className="Search__spinner">
                            <DelayedSpinner />
                        </div>
                    )}
                    {!this.props.hasError && this.props.initialSearchDone && (
                        <RestoreScroll>
                            <div>
                                <Row>
                                    <form
                                        role="search"
                                        action="/"
                                        onSubmit={this.onSearchFormSubmit}
                                        className="no-print"
                                    >
                                        <Column xs="12" md="4">
                                            <div id="sok">
                                                <SearchBox />
                                                <Published />
                                                <Occupations />
                                                <Counties />
                                                <Extent />
                                                <EngagementType />
                                                <Sector />
                                            </div>
                                        </Column>
                                        <Column xs="12" md="5">
                                            <ViewMode />
                                        </Column>
                                        <Column xs="12" md="3">
                                            <Sorting />
                                        </Column>
                                    </form>
                                    <Column xs="12" md="8">
                                        <div id="sokeresultat">
                                            <SearchResults />
                                        </div>
                                    </Column>
                                </Row>
                                <BackToTop />
                            </div>
                        </RestoreScroll>
                    )}
                </Container>
            </div>
        );
    }
}

Search.propTypes = {
    restorePreviousSearch: PropTypes.func.isRequired,
    initialSearch: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    rememberSearch: PropTypes.func.isRequired,
    fetchFavorites: PropTypes.func.isRequired,
    hasError: PropTypes.bool.isRequired,
    initialSearchDone: PropTypes.bool.isRequired,
    favorites: PropTypes.arrayOf(PropTypes.object).isRequired,
    isFetchingFavorites: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    hasError: state.search.hasError,
    initialSearchDone: state.search.initialSearchDone,
    favorites: state.favorites.favorites,
    isFetchingFavorites: state.favorites.isFetchingFavorites
});

const mapDispatchToProps = (dispatch) => ({
    restorePreviousSearch: () => dispatch({ type: RESTORE_PREVIOUS_SEARCH }),
    initialSearch: () => dispatch({ type: INITIAL_SEARCH }),
    search: () => dispatch({ type: SEARCH }),
    rememberSearch: () => dispatch({ type: REMEMBER_SEARCH }),
    fetchFavorites: () => dispatch({ type: FETCH_FAVORITES })
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
