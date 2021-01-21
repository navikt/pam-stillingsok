import {Column, Container, Row} from 'nav-frontend-grid';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Flatknapp} from 'pam-frontend-knapper';
import {authenticationEnum} from '../authentication/authenticationReducer';
import {CONTEXT_PATH, STILLINGSOK_URL} from '../fasitProperties';
import FavouriteAlertStripe from '../favourites/alertstripe/FavouriteAlertStripe';
import SavedSearchAlertStripe from '../savedSearches/alertstripe/SavedSearchAlertStripe';
import CurrentSavedSearch from '../savedSearches/CurrentSavedSearch';
import SavedSearchesExpandButton from '../savedSearches/expand/SavedSearchesExpandButton';
import SavedSearchForm from '../savedSearches/form/SavedSearchForm';
import SaveSearchButton from '../savedSearches/SaveSearchButton';
import {RESTORE_STATE_FROM_URL_BEGIN} from './searchQueryReducer';
import Counties from './facets/Locations';
import EngagementType from './facets/Engagement';
import Extent from './facets/Extent';
import Occupations from './facets/Occupations';
import Published from './facets/Published';
import Sector from './facets/Sector';
import DelayedSpinner from '../common/components/DelayedSpinner';
import RestoreScroll from '../common/components/RestoreScroll';
import './Search.less';
import SearchBox from './searchBox/SearchBox';
import {INITIAL_SEARCH, RESET_SEARCH, SEARCH} from './searchReducer';
import SearchResultCount from './searchResults/SearchResultCount';
import SearchResults from './searchResults/SearchResults';
import ShowResultsButton from './showResultsButton/ShowResultsButton';
import Sorting from './sorting/Sorting';
import {useDocumentTitle, useTrackPageview} from '../common/hooks';
import AdStatisticsLink from "../common/components/AdStatisticsLink";
import SearchErrorBox from "../common/components/SearchErrorBox";

const Search = ({
                    initialSearch,
                    initialSearchDone,
                    isAuthenticated,
                    isSearching,
                    resetSearch,
                    restoreStateFromUrl,
                    search,
                    user,
                    searchFailed
                }) => {
    useState(() => {
        restoreStateFromUrl();
    });

    useTrackPageview(CONTEXT_PATH, 'Ledige stillinger');
    useDocumentTitle('Ledige stillinger - Arbeidsplassen - Norges nye jobbsøk');

    useEffect(() => {
        initialSearch();
    }, []);

    const onSearchFormSubmit = (e) => {
        e.preventDefault();
        search();
    };

    const redirectToSearchQuery = () => {
        window.location = `${STILLINGSOK_URL}/stillinger?q=KoronaBeredskapNord`;
    }

    return (
        <div className="Search">
            <FavouriteAlertStripe/>
            <SavedSearchAlertStripe/>
            <ShowResultsButton/>

            <Container className="Search__main">
                {searchFailed && <SearchErrorBox />}
                {!searchFailed && isSearching && !initialSearchDone && (
                    <div className="Search__spinner">
                        <DelayedSpinner/>
                    </div>
                )}
                {!searchFailed && initialSearchDone && (
                    <RestoreScroll id="Search">
                        <Row>
                            <Column xs="12" md="4">
                                <div className="Search__main__left">

                                    <div className="Search__main__left__save-search">
                                        <SaveSearchButton/>
                                        {(isAuthenticated === authenticationEnum.IS_AUTHENTICATED && user) && (
                                            <SavedSearchesExpandButton/>
                                        )}
                                    </div>
                                    <div id="sok">
                                        <form
                                            action={CONTEXT_PATH}
                                            onSubmit={onSearchFormSubmit}
                                            className="no-print"
                                        >
                                            <SearchBox/>
                                            <AdStatisticsLink/>
                                            <Flatknapp
                                                className="Search__nullstill"
                                                mini
                                                onClick={() => resetSearch()}
                                            >
                                                Nullstill kriterier
                                            </Flatknapp>
                                            <Published/>
                                            <Occupations/>
                                            <Counties/>
                                            <Extent/>
                                            <EngagementType/>
                                            <Sector/>
                                        </form>
                                    </div>
                                </div>
                            </Column>
                            <Column xs="12" md="8">
                                <div id="treff" className="Search__main__center">
                                    <div className="Search__main__center__header">
                                        <div className="Search__main__center__header__left">
                                            <SearchResultCount/>
                                            <CurrentSavedSearch/>
                                        </div>
                                        <div className="Search__main__center__header__right">
                                            <Sorting/>
                                        </div>
                                    </div>
                                    <SearchResults/>
                                </div>
                            </Column>
                        </Row>
                        <div className="Search__main__tiltoppen">
                            <a href="#top" className="link">Til toppen</a>
                        </div>
                    </RestoreScroll>
                )}
            </Container>
            <SavedSearchForm/>
        </div>
    );
};

Search.defaultProps = {
    user: undefined
};

Search.propTypes = {
    restoreStateFromUrl: PropTypes.func.isRequired,
    initialSearch: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    resetSearch: PropTypes.func.isRequired,
    initialSearchDone: PropTypes.bool.isRequired,
    isSearching: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.string.isRequired,
    user: PropTypes.shape({}),
    searchFailed: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    initialSearchDone: state.search.initialSearchDone,
    isSearching: state.search.isSearching,
    isFetchingFavourites: state.favourites.isFetchingFavourites,
    savedSearches: state.savedSearches.savedSearches,
    isSavedSearchesExpanded: state.savedSearchExpand.isSavedSearchesExpanded,
    isAuthenticated: state.authentication.isAuthenticated,
    user: state.user.user,
    searchFailed: state.error.searchFailed
});

const mapDispatchToProps = (dispatch) => ({
    restoreStateFromUrl: () => dispatch({type: RESTORE_STATE_FROM_URL_BEGIN}),
    initialSearch: () => dispatch({type: INITIAL_SEARCH}),
    search: () => dispatch({type: SEARCH}),
    resetSearch: () => dispatch({type: RESET_SEARCH})
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
