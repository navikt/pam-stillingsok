import { Column, Container, Row } from 'nav-frontend-grid';
import { Flatknapp } from 'nav-frontend-knapper';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import PageHeader from '../common/pageHeader/PageHeader';
import Disclaimer from '../discalimer/Disclaimer';
import FavouriteAlertStripe from '../favourites/alertstripe/FavouriteAlertStripe';
import FavouriteError from '../favourites/error/FavouriteError';
import { FETCH_FAVOURITES } from '../favourites/favouritesReducer';
import ShowFavouriteListLink from '../favourites/ShowFavouriteListLink';
import featureToggle from '../featureToggle';
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
import SearchResultCount from './searchResults/SearchResultCount';
import SearchResults from './searchResults/SearchResults';
import Sorting from './sorting/Sorting';
import ViewMode from './viewMode/ViewMode';
import NotLoggedIn from '../authorization/NotLoggedIn';
import { FETCH_USER } from '../authorization/authorizationReducer';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.props.restoreStateFromUrl();
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
                <NotLoggedIn />
                <PageHeader
                    title="Ledige stillinger"
                    buttons={featureToggle() && this.props.isLoggedIn ?
                        <div>
                            <ShowFavouriteListLink />
                            <ExpandSavedSearchButton />
                        </div> : null
                    }
                />
                {this.props.isSavedSearchesExpanded && (
                    <div className="Search__header__savedSearches">
                        <SavedSearchesExpand />
                    </div>
                )}
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
                                                {featureToggle() && (
                                                    <div>
                                                        <SaveSearchButton />
                                                        <Flatknapp mini onClick={this.onResetSearchClick}>
                                                            Nullstill kriterier
                                                        </Flatknapp>
                                                    </div>
                                                )}
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
                                        <div id="treff" className="Search__main__center">
                                            <div className="Search__main__center__header">
                                                <div className="Search__main__center__header__left">
                                                    <SearchResultCount />
                                                    <CurrentSavedSearch />
                                                </div>
                                                <div className="Search__main__center__header__right">
                                                    <ViewMode />
                                                    <Sorting />
                                                </div>
                                            </div>
                                            <SearchResults />
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
    isSavedSearchesExpanded: PropTypes.bool.isRequired,
    hasError: PropTypes.bool.isRequired,
    initialSearchDone: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    hasError: state.search.hasError,
    initialSearchDone: state.search.initialSearchDone,
    isFetchingFavourites: state.favourites.isFetchingFavourites,
    savedSearches: state.savedSearches.savedSearches,
    isLoggedIn: state.authorization.isLoggedIn,
    isSavedSearchesExpanded: state.savedSearchExpand.isSavedSearchesExpanded
});

const mapDispatchToProps = (dispatch) => ({
    restoreStateFromUrl: () => dispatch({ type: RESTORE_STATE_FROM_URL_BEGIN }),
    initialSearch: () => dispatch({ type: INITIAL_SEARCH }),
    search: () => dispatch({ type: SEARCH }),
    resetSearch: () => dispatch({ type: RESET_SEARCH }),
    fetchSavedSearches: () => dispatch({ type: FETCH_SAVED_SEARCHES }),
    fetchFavourites: () => dispatch({ type: FETCH_FAVOURITES }),
    fetchUser: () => dispatch({ type: FETCH_USER })
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
