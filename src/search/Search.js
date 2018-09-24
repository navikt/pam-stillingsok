import { Column, Container, Row } from 'nav-frontend-grid';
import { Knapp } from 'nav-frontend-knapper';
import { Normaltekst, Sidetittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Lenkeknapp from '../common/Lenkeknapp';
import Disclaimer from '../discalimer/Disclaimer';
import FavouriteAlertStripe from '../favourites/alertstripe/FavouriteAlertStripe';
import FavouriteError from '../favourites/error/FavouriteError';
import FavouritesButton from '../favourites/FavouritesButton';
import { FETCH_FAVOURITES } from '../favourites/favouritesReducer';
import SavedSearchAlertStripe from '../savedSearches/alertstripe/SavedSearchAlertStripe';
import SavedSearchError from '../savedSearches/error/SavedSearchError';
import SavedSearchesExpand from '../savedSearches/expand/SavedSearchesExpand';
import SavedSearchForm from '../savedSearches/form/SavedSearchForm';
import { SavedSearchFormMode, SHOW_SAVED_SEARCH_FORM } from '../savedSearches/form/savedSearchFormReducer';
import SavedSearchButton from '../savedSearches/SavedSearchButton';
import { FETCH_SAVED_SEARCHES } from '../savedSearches/savedSearchesReducer';
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
import { INITIAL_SEARCH, REMEMBER_SEARCH, RESET_SEARCH, SEARCH } from './searchReducer';
import SearchResults from './searchResults/SearchResults';
import SearchResultsCount from './searchResults/SearchResultsCount';
import Sorting from './sorting/Sorting';
import ViewMode from './viewMode/ViewMode';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.props.initialSearch();
    }

    componentDidMount() {
        this.props.fetchFavourites();
        this.props.fetchSavedSearches();
        document.title = 'Ledige stillinger';
    }

    componentWillUnmount() {
        this.props.rememberSearch();
    }

    onSearchFormSubmit = (e) => {
        e.preventDefault();
        this.props.search();
    };

    onSaveSearchClick = () => {
        this.props.showSavedSearchForm(
            this.props.currentSavedSearch ? SavedSearchFormMode.EDIT : SavedSearchFormMode.ADD,
            this.props.currentSavedSearch !== undefined,
            'Tilbake til stillingssøk'
        );
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
                                        <SavedSearchButton />
                                    </div>
                                </Column>
                            </Row>
                        </Container>
                    </div>
                    {this.props.isSavedSearchesExpanded && (
                        <div className="Search__header__savedSearches">
                            <SavedSearchesExpand />
                        </div>
                    )}
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
                                                <Knapp mini onClick={this.onSaveSearchClick}>Lagre søk</Knapp>
                                                <Lenkeknapp onClick={this.onResetSearchClick}>
                                                    Nullstill kriterier
                                                </Lenkeknapp>
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
                                                {this.props.currentSavedSearch && (
                                                    <div>
                                                        <Normaltekst>{this.props.currentSavedSearch.title}</Normaltekst>
                                                    </div>
                                                )}
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

Search.defaultProps = {
    currentSavedSearch: undefined
};

Search.propTypes = {
    initialSearch: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    resetSearch: PropTypes.func.isRequired,
    rememberSearch: PropTypes.func.isRequired,
    fetchFavourites: PropTypes.func.isRequired,
    fetchSavedSearches: PropTypes.func.isRequired,
    showSavedSearchForm: PropTypes.func.isRequired,
    hasError: PropTypes.bool.isRequired,
    initialSearchDone: PropTypes.bool.isRequired,
    isSavedSearchesExpanded: PropTypes.bool.isRequired,
    currentSavedSearch: PropTypes.shape({
        title: PropTypes.string
    })
};

const mapStateToProps = (state) => ({
    hasError: state.search.hasError,
    initialSearchDone: state.search.initialSearchDone,
    isFetchingFavourites: state.favourites.isFetchingFavourites,
    savedSearches: state.savedSearches.savedSearches,
    isSavedSearchesExpanded: state.savedSearchExpand.isSavedSearchesExpanded,
    currentSavedSearch: state.savedSearches.currentSavedSearch
});

const mapDispatchToProps = (dispatch) => ({
    initialSearch: () => dispatch({ type: INITIAL_SEARCH }),
    search: () => dispatch({ type: SEARCH }),
    resetSearch: () => dispatch({ type: RESET_SEARCH }),
    rememberSearch: () => dispatch({ type: REMEMBER_SEARCH }),
    fetchSavedSearches: () => dispatch({ type: FETCH_SAVED_SEARCHES }),
    fetchFavourites: () => dispatch({ type: FETCH_FAVOURITES }),
    showSavedSearchForm: (formMode, showAddOrReplace, cancelButtonText) => dispatch({
        type: SHOW_SAVED_SEARCH_FORM,
        formMode,
        showAddOrReplace,
        cancelButtonText
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
