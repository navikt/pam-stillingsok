import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Column } from 'nav-frontend-grid';
import SearchResultCount from './components/SearchResultCount';
import SearchResultList from './components/SearchResultList';
import SearchResultError from './components/SearchResultError';
import SearchResultPagination from './components/SearchResultPagination';
import SearchResultSorting from './components/SearchResultSorting';
import SearchForm from './components/SearchForm';
import NoResults from './components/NoResults';
import {
    INITIAL_SEARCH,
    SEARCH
} from "./domene";

class SearchPage extends React.Component {

    constructor(props) {
        super(props);
        this.props.initialSearch(props.urlParams);
    }

    scrollToTopOfResultList = () => {
        this.resultatListe.scrollIntoView();
    };

    render() {
        return (
            <div>
                <div className="search-page-header"/>
                <Container className="search-page-margin">
                    {this.props.error ? (
                        <SearchResultError />
                    ) : (
                        <Row>
                            <Column xs="12" md="4">
                                <SearchForm />
                            </Column>
                            <Column xs="12" md="8">
                                <div className="search-result-count-wrapper">
                                    <Row>
                                        <Column xs="12" md="8">
                                            <SearchResultCount/>
                                        </Column>
                                        <Column xs="12" md="4">
                                            <SearchResultSorting />
                                        </Column>
                                    </Row>
                                </div>
                                {this.props.searchResultTotal > 0 && (
                                    <section
                                        tabIndex="-1"
                                        id="sokeresultat"
                                        aria-labelledby="search-result-count"
                                        ref={(resultatListe) => {
                                            this.resultatListe = resultatListe;
                                        }}
                                    >
                                        <SearchResultList />
                                        <SearchResultPagination scrollToTopOfResultList={this.scrollToTopOfResultList} />
                                    </section>
                                )}
                                {!this.props.isSearching && this.props.searchResultTotal === 0 && (
                                    <NoResults />
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
    isSearching: state.isSearching,
    searchResultTotal: state.searchResult.total,
    error: state.error
});

const mapDispatchToProps = (dispatch) => ({
    initialSearch: (query) => dispatch({ type: INITIAL_SEARCH, query }),
    search: () => dispatch({ type: SEARCH })
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);