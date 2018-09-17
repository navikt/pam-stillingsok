import { Column, Container, Row } from 'nav-frontend-grid';
import { Knapp } from 'nav-frontend-knapper';
import { Sidetittel } from 'nav-frontend-typografi';
import Chevron from 'nav-frontend-chevron';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Disclaimer from '../discalimer/Disclaimer';
import FavoriteAlertStripe from '../favorites/FavoriteAlertStripe';
import FavoriteError from '../favorites/FavoriteError';
import { FETCH_FAVORITES } from '../favorites/favoritesReducer';
import AddSavedSearchModal from '../savedSearches/AddSavedSearchModal';
import SavedSearchesAlertStripe from '../savedSearches/SavedSearchesAlertStripe';
import SavedSearchesError from '../savedSearches/SavedSearchesError';
import SavedSearchesExpand from '../savedSearches/SavedSearchesExpand';
import {
    COLLAPSE_SAVED_SEARCHES,
    EXPAND_SAVED_SEARCHES,
    FETCH_SAVED_SEARCHES,
    SHOW_ADD_SAVED_SEARCH_MODAL
} from '../savedSearches/savedSearchesReducer';
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
import { INITIAL_SEARCH, REMEMBER_SEARCH, SEARCH } from './searchReducer';
import SearchResults from './searchResults/SearchResults';
import Sorting from './sorting/Sorting';
import ViewMode from './viewMode/ViewMode';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.props.initialSearch();
    }

    componentDidMount() {
        this.props.fetchFavorites();
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
        this.props.showAddSavedSearchModal();
    };

    onSavedSearchesButtonClick = () => {
        if(this.props.isSavedSearchesExpanded) {
            this.props.collapseSavedSearches();
        } else {
            this.props.expandSavedSearches();
        }
    };

    render() {
        return (
            <div className="Search">
                <Disclaimer />
                <FavoriteAlertStripe />
                <FavoriteError />
                <SavedSearchesAlertStripe />
                <SavedSearchesError />
                <div className="Search__header">
                    <div className="Search__header__green">
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
                                        <Knapp mini to="/lagrede-sok" onClick={this.onSavedSearchesButtonClick}>
                                            Lagrede søk {!this.props.isFetchingSavedSearches ? ` (${this.props.savedSearches.length})` : ''}
                                            <Chevron
                                                className="SavedSearchExpandButton__chevron"
                                                type={this.props.isSavedSearchesExpanded ? 'opp' : 'ned'}
                                            />
                                        </Knapp>
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
                                    <form
                                        role="search"
                                        action="/"
                                        onSubmit={this.onSearchFormSubmit}
                                        className="no-print"
                                    >
                                        <Column xs="12" md="4">
                                            <div id="sok">
                                                <div className="blokk-xs">
                                                    <Knapp mini onClick={this.onSaveSearchClick}>Lagre søk</Knapp>
                                                </div>
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
                <AddSavedSearchModal />
            </div>
        );
    }
}

Search.propTypes = {
    showAddSavedSearchModal: PropTypes.func.isRequired,
    initialSearch: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    rememberSearch: PropTypes.func.isRequired,
    fetchFavorites: PropTypes.func.isRequired,
    fetchSavedSearches: PropTypes.func.isRequired,
    hasError: PropTypes.bool.isRequired,
    initialSearchDone: PropTypes.bool.isRequired,
    favorites: PropTypes.arrayOf(PropTypes.object).isRequired,
    isFetchingFavorites: PropTypes.bool.isRequired,
    savedSearches: PropTypes.arrayOf(PropTypes.object).isRequired,
    isFetchingSavedSearches: PropTypes.bool.isRequired,
    isSavedSearchesExpanded: PropTypes.bool.isRequired,
    expandSavedSearches: PropTypes.func.isRequired,
    collapseSavedSearches: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    hasError: state.search.hasError,
    initialSearchDone: state.search.initialSearchDone,
    favorites: state.favorites.favorites,
    isFetchingFavorites: state.favorites.isFetchingFavorites,
    savedSearches: state.savedSearches.savedSearches,
    isFetchingSavedSearches: state.savedSearches.isFetchingSavedSearches,
    isSavedSearchesExpanded: state.savedSearches.isSavedSearchesExpanded
});

const mapDispatchToProps = (dispatch) => ({
    showAddSavedSearchModal: () => dispatch({ type: SHOW_ADD_SAVED_SEARCH_MODAL }),
    initialSearch: () => dispatch({ type: INITIAL_SEARCH }),
    search: () => dispatch({ type: SEARCH }),
    rememberSearch: () => dispatch({ type: REMEMBER_SEARCH }),
    fetchSavedSearches: () => dispatch({ type: FETCH_SAVED_SEARCHES }),
    fetchFavorites: () => dispatch({ type: FETCH_FAVORITES }),
    expandSavedSearches: () => dispatch({ type: EXPAND_SAVED_SEARCHES }),
    collapseSavedSearches: () => dispatch({ type: COLLAPSE_SAVED_SEARCHES })
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
