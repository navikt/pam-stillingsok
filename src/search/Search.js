import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Column } from 'nav-frontend-grid';
import SearchResultCount from './searchResults/SearchResultsCount';
import SearchResultList from './searchResults/SearchResults';
import SearchResultError from './error/SearchError';
import SearchResultPagination from './pagination/Pagination';
import SearchResultSorting from './sorting/Sorting';
import Counties from './facets/counties/Counties';
import HeltidDeltid from './facets/extent/Extent';
import EngagementType from './facets/engagement/Engagement';
import Sector from './facets/sector/Sector';
import Created from './facets/created/Created';
import SearchBox from './searchBox/SearchBox';
import NoResults from './searchResults/NoSearchResults';
import { INITIAL_SEARCH, SEARCH } from './searchSagas';
import './Search.less';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.props.initialSearch();
    }

    onSearchFormSubmit = (e) => {
        e.preventDefault();
        this.props.search();
    };

    scrollToTopOfResultList = () => {
        this.resultatListe.scrollIntoView();
    };

    render() {
        return (
            <div>
                <div className="search-page-header"/>
                <Container className="search-page-margin">
                    {this.props.error ? (
                        <SearchResultError/>
                    ) : (
                        <Row>
                            <Column xs="12" md="4">
                                <form
                                    role="search"
                                    id="search-form"
                                    name="filter"
                                    action="/"
                                    method="get"
                                    onSubmit={this.onSearchFormSubmit}
                                >
                                    <div id="search-form-fritekst-input-wrapper">
                                        <SearchBox onSubmit={this.onSearchFormSubmit}/>
                                        <a
                                            href="#sokeresultat"
                                            className="typo-normal lenke sr-only sr-only-focusable"
                                        >
                                            Hopp til søkeresultat
                                        </a>
                                    </div>
                                    <Created/>
                                    <Counties/>
                                    <HeltidDeltid/>
                                    <EngagementType/>
                                    <Sector/>
                                </form>
                            </Column>
                            <Column xs="12" md="8">
                                <div
                                    className="search-result-count-wrapper"
                                    ref={(resultatListe) => {
                                        this.resultatListe = resultatListe;
                                    }}
                                >
                                    <Row>
                                        <Column xs="12" md="8">
                                            <SearchResultCount/>
                                        </Column>
                                        <Column xs="12" md="4">
                                            <SearchResultSorting/>
                                        </Column>
                                    </Row>
                                </div>
                                {this.props.searchResultTotal > 0 && (
                                    <section
                                        tabIndex="-1"
                                        id="sokeresultat"
                                        aria-labelledby="search-result-count"
                                    >
                                        <SearchResultList/>
                                        <SearchResultPagination scrollToTopOfResultList={this.scrollToTopOfResultList}/>
                                    </section>
                                )}
                                {!this.props.isSearching && this.props.searchResultTotal === 0 && (
                                    <NoResults/>
                                )}
                            </Column>
                        </Row>
                    )}
                </Container>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    isSearching: state.searchResults.isSearching,
    searchResultTotal: state.searchResults.searchResult.total,
    error: state.searchResults.error
});

const mapDispatchToProps = (dispatch) => ({
    initialSearch: (query) => dispatch({ type: INITIAL_SEARCH }),
    search: () => dispatch({ type: SEARCH })
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
