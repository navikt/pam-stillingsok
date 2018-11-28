import { Column, Container, Row } from 'nav-frontend-grid';
import { Flatknapp } from 'nav-frontend-knapper';
import { Sidetittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { CONTEXT_PATH } from '../fasitProperties';
import FavouriteAlertStripe from '../favourites/alertstripe/FavouriteAlertStripe';
import ShowFavouriteListLink from '../favourites/ShowFavouriteListLink';
import featureToggle from '../featureToggle';
import SavedSearchAlertStripe from '../savedSearches/alertstripe/SavedSearchAlertStripe';
import CurrentSavedSearch from '../savedSearches/CurrentSavedSearch';
import SavedSearchesExpand from '../savedSearches/expand/SavedSearchesExpand';
import ExpandSavedSearchButton from '../savedSearches/ExpandSavedSearchButton';
import SavedSearchForm from '../savedSearches/form/SavedSearchForm';
import SaveSearchButton from '../savedSearches/SaveSearchButton';
import { RESTORE_STATE_FROM_URL_BEGIN } from '../urlReducer';
import ShowResultsButton from './showResultsButton/ShowResultsButton';
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

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.props.restoreStateFromUrl();
        this.props.initialSearch();
    }

    componentDidMount() {
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
                <FavouriteAlertStripe />
                <SavedSearchAlertStripe />
                <div className="Search__header">
                    <Container className="Search__header__container">
                        <Row className="Search__header__row">
                            <Column xs="12" lg="4" />
                            <Column xs="12" lg="4">
                                <Sidetittel className="Search__header__title">Ledige stillinger</Sidetittel>
                            </Column>
                            <Column xs="12" lg="4">
                                {featureToggle() && this.props.isAuthenticated !== false && this.props.user ?
                                    <div className="Search__header__left">
                                        <ShowFavouriteListLink />
                                        <ExpandSavedSearchButton />
                                        <Link to={`${CONTEXT_PATH}/innstillinger`} className="Search__innstillinger-lenke lenke typo-element">
                                            Innstillinger
                                        </Link>
                                    </div> : null
                                }
                            </Column>
                        </Row>
                    </Container>
                </div>
                {this.props.isSavedSearchesExpanded && (
                    <div className="Search__header__savedSearches">
                        <SavedSearchesExpand />
                    </div>
                )}
                <ShowResultsButton />
                <Container className="Search__main">

                    {!this.props.initialSearchDone && (
                        <div className="Search__spinner">
                            <DelayedSpinner />
                        </div>
                    )}
                    {this.props.initialSearchDone && (
                        <RestoreScroll>
                            <div>
                                <Row>
                                    <Column xs="12" md="4">
                                        <div className="Search__main__left">
                                            <div className="Search__main__left__save-search">
                                                {featureToggle() && (
                                                    <SaveSearchButton />
                                                )}
                                                <Flatknapp mini onClick={this.onResetSearchClick}>
                                                            Nullstill kriterier
                                                </Flatknapp>
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
                                            <div className="Search__main__tiltoppen">
                                                <a href="#top" className="lenke typo-normal">Til toppen</a>
                                            </div>
                                        </div>
                                    </Column>
                                </Row>
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
    user: undefined,
    isAuthenticated: undefined
};

Search.propTypes = {
    restoreStateFromUrl: PropTypes.func.isRequired,
    initialSearch: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    resetSearch: PropTypes.func.isRequired,
    isSavedSearchesExpanded: PropTypes.bool.isRequired,
    initialSearchDone: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.bool,
    user: PropTypes.shape({})
};

const mapStateToProps = (state) => ({
    initialSearchDone: state.search.initialSearchDone,
    isFetchingFavourites: state.favourites.isFetchingFavourites,
    savedSearches: state.savedSearches.savedSearches,
    isSavedSearchesExpanded: state.savedSearchExpand.isSavedSearchesExpanded,
    isAuthenticated: state.user.isAuthenticated,
    user: state.user.user
});

const mapDispatchToProps = (dispatch) => ({
    restoreStateFromUrl: () => dispatch({ type: RESTORE_STATE_FROM_URL_BEGIN }),
    initialSearch: () => dispatch({ type: INITIAL_SEARCH }),
    search: () => dispatch({ type: SEARCH }),
    resetSearch: () => dispatch({ type: RESET_SEARCH })
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
