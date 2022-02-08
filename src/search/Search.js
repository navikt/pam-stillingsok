import {Column, Container, Row} from 'nav-frontend-grid';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import { Knapp } from '@navikt/arbeidsplassen-knapper';
import {CONTEXT_PATH, STILLINGSOK_URL} from '../fasitProperties';
import FavouriteAlertStripe from '../favourites/alertstripe/FavouriteAlertStripe';
import SavedSearchAlertStripe from '../savedSearches/alertstripe/SavedSearchAlertStripe';
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
import SearchErrorBox from "../common/components/SearchErrorBox";
import { track } from '../analytics';

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
            <a id="main-content" tabIndex="-1" />
            <FavouriteAlertStripe/>
            <SavedSearchAlertStripe/>
            <div className="PageHeader PageHeader--no-mb">
                <div className="PageHeader__container">
                    <Row className="PageHeader__row">
                        <Column xs="12">
                            <h1 className="PageHeader__title">Ledige stillinger</h1>
                        </Column>
                    </Row>
                </div>
            </div>
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
                                    <div id="sok">
                                        <form
                                            action={CONTEXT_PATH}
                                            onSubmit={onSearchFormSubmit}
                                            className="no-print"
                                            role="search"
                                            aria-labelledby="search-form-title"
                                        >
                                            <h2 className="Search__form-title" id="search-form-title">
                                                Søk blant ledige stillinger
                                            </h2>
                                            <SearchBox/>
                                            <Counties/>
                                            <Occupations/>
                                            <Published/>
                                            <Extent/>
                                            <EngagementType/>
                                            <Sector/>
                                        </form>
                                        <div className="Search__main__left__save-search">
                                            <SaveSearchButton/>
                                            <Knapp
                                                className="Search__nullstill"
                                                onClick={() => {
                                                    track('send', 'event', 'ux-test-juni-2021', 'Trykket  Nullstill kriterier-knapp');
                                                    return resetSearch();
                                                }}
                                            >
                                                Nullstill søk
                                            </Knapp>
                                        </div>
                                    </div>
                                </div>
                            </Column>
                            <Column xs="12" md="8">
                                <div id="treff" className="Search__main__center">
                                    <div className="Search__main__center__header">
                                        <div className="Search__main__center__header__left">
                                            <SearchResultCount/>
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
                            <a href="#top" className="Knapp--link" onClick={() => {
                                track('send', 'event', 'ux-test-juni-2021', 'Klikket Til toppen-lenke');
                            }}>Til toppen</a>
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
