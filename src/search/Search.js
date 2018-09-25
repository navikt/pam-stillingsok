import { Column, Container, Row } from 'nav-frontend-grid';
import { Knapp } from 'nav-frontend-knapper';
import { Sidetittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Disclaimer from '../discalimer/Disclaimer';
import FavouriteAlertStripe from '../favourites/alertstripe/FavouriteAlertStripe';
import FavouriteError from '../favourites/error/FavouriteError';
import FavouritesButton from '../favourites/FavouritesButton';
import { FETCH_FAVOURITES } from '../favourites/favouritesReducer';
import SavedSearchAlertStripe from '../savedSearches/alertstripe/SavedSearchAlertStripe';
import CurrentSavedSearch from '../savedSearches/CurrentSavedSearch';
import SavedSearchError from '../savedSearches/error/SavedSearchError';
import SavedSearchesExpand from '../savedSearches/expand/SavedSearchesExpand';
import ExpandSavedSearchButton from '../savedSearches/ExpandSavedSearchButton';
import SavedSearchForm from '../savedSearches/form/SavedSearchForm';
import { FETCH_SAVED_SEARCHES } from '../savedSearches/savedSearchesReducer';
import SaveSearchButton from '../savedSearches/SaveSearchButton';
import { RESTORE_STATE_FROM_URL_BEGIN } from '../urlReducer';
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
import { INITIAL_SEARCH, RESET_SEARCH, SEARCH } from './searchReducer';
import SearchResults from './searchResults/SearchResults';
import SearchResultsCount from './searchResults/SearchResultsCount';
import Sorting from './sorting/Sorting';
import ViewMode from './viewMode/ViewMode';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.props.restoreStateFromUrl(sessionStorage.getItem('url'));
        this.props.initialSearch();
    }

    componentDidMount() {
        this.props.fetchFavourites();
        this.props.fetchSavedSearches();
        document.title = 'Ledige stillinger';
    }

    onSearchFormSubmit = (e) => {
        e.preventDefault();
        this.props.search();
    };

    onResetSearchClick = () => {
        this.props.resetSearch();
    };

    render() {
        return (
            <div className="Search">
                <Disclaimer />
                <FavouriteAlertStripe />
                <FavouriteError />
                <SavedSearchAlertStripe />
                <SavedSearchError />
                <div className="Search__header">
                    <div className="Search__header__green">
                        <Container>
                            <Row>
                                <Column xs="12" md="6">
                                    <Sidetittel className="Search__header__title">Ledige stillinger</Sidetittel>
                                </Column>
                                <Column xs="12" md="6">
                                    <div className="Search__header__right">
                                        <FavouritesButton />
                                        <ExpandSavedSearchButton />
                                    </div>
                                </Column>
                            </Row>
                        </Container>
                    </div>
                    <div className="Search__header__savedSearches">
                        <SavedSearchesExpand />
                    </div>
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
                                    <Column xs="12" md="4">
                                        <div className="Search__main__left">
                                            <div className="Search__main__left__save-search">
                                                <SaveSearchButton />
                                                <Knapp mini onClick={this.onResetSearchClick}>
                                                    Nullstill kriterier
                                                </Knapp>
                                            </div>
                                            <div id="sok">
                                                <form
                                                    role="search"
                                                    action="/"
                                                    onSubmit={this.onSearchFormSubmit}
                                                    className="no-print"
                                                >
                                                    <SearchBox />
                                                    <Published />
                                                    <Occupations />
                                                    <Counties />
                                                    <Extent />
                                                    <EngagementType />
                                                    <Sector />
                                                </form>
                                            </div>
                                        </div>
                                    </Column>
                                    <Column xs="12" md="8">
                                        <div className="Search__main__center">
                                            <div className="Search__main__center__header">
                                                <SearchResultsCount />
                                                <CurrentSavedSearch />
                                                <ViewMode />
                                                <Sorting />
                                            </div>
                                            <div id="sokeresultat">
                                                <SearchResults />
                                            </div>
                                        </div>
                                    </Column>
                                </Row>
                                <BackToTop />
                            </div>
                        </RestoreScroll>
                    )}
                </Container>
                <SavedSearchForm />
            </div>
        );
    }
}

Search.propTypes = {
    restoreStateFromUrl: PropTypes.func.isRequired,
    initialSearch: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    resetSearch: PropTypes.func.isRequired,
    fetchFavourites: PropTypes.func.isRequired,
    fetchSavedSearches: PropTypes.func.isRequired,
    hasError: PropTypes.bool.isRequired,
    initialSearchDone: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    hasError: state.search.hasError,
    initialSearchDone: state.search.initialSearchDone,
    isFetchingFavourites: state.favourites.isFetchingFavourites,
    savedSearches: state.savedSearches.savedSearches
});

const mapDispatchToProps = (dispatch) => ({
    restoreStateFromUrl: (url) => dispatch({ type: RESTORE_STATE_FROM_URL_BEGIN, url }),
    initialSearch: () => dispatch({ type: INITIAL_SEARCH }),
    search: () => dispatch({ type: SEARCH }),
    resetSearch: () => dispatch({ type: RESET_SEARCH }),
    fetchSavedSearches: () => dispatch({ type: FETCH_SAVED_SEARCHES }),
    fetchFavourites: () => dispatch({ type: FETCH_FAVOURITES })
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
