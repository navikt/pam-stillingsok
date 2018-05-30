import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Column } from 'nav-frontend-grid';
import SearchResultCount from './searchresult/ResultCount';
import SearchResultList from './searchresult/ResultList';
import SearchResultError from './error/SearchError';
import SearchResultPagination from './pagination/Pagination';
import SearchResultSorting from './sorting/Sorting';
import Counties from './facets/counties/Counties';
import HeltidDeltid from './facets/extent/Extent';
import EngagementType from './facets/engagement/Engagement';
import Sector from './facets/sector/Sector';
import Created from './facets/created/Created';
import SearchBox from './searchbox/SearchBox';
import NoResults from './noresult/NoResult';
import {
    INITIAL_SEARCH,
    SEARCH
} from './domene';
import './Search.less';

export function getUrlParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) return undefined;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export const getInitialStateFromUrl = (url) => {
    const stateFromUrl = {};
    const q = getUrlParameterByName('q', url);
    const from = getUrlParameterByName('from', url);
    const sort = getUrlParameterByName('sort', url);
    const counties = getUrlParameterByName('counties', url);
    const municipals = getUrlParameterByName('municipals', url);
    const heltidDeltid = getUrlParameterByName('heltidDeltid', url);
    const engagementType = getUrlParameterByName('engagementType', url);
    const sector = getUrlParameterByName('sector', url);
    const created = getUrlParameterByName('created', url);

    if (q) stateFromUrl.q = q;
    if (from) stateFromUrl.from = parseInt(from, 10);
    if (sort) stateFromUrl.sort = sort;
    if (counties) stateFromUrl.counties = counties.split('_');
    if (municipals) stateFromUrl.municipals = municipals.split('_');
    if (heltidDeltid) stateFromUrl.heltidDeltid = heltidDeltid.split('_');
    if (engagementType) stateFromUrl.engagementType = engagementType.split('_');
    if (sector) stateFromUrl.sector = sector.split('_');
    if (created) stateFromUrl.created = created.split('_');
    return stateFromUrl;
};

class Search extends React.Component {
    constructor(props) {
        super(props);
        const query = getInitialStateFromUrl(window.location.href);
        this.props.initialSearch(query);
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
    isSearching: state.search.isSearching,
    searchResultTotal: state.search.searchResult.total,
    error: state.search.error
});

const mapDispatchToProps = (dispatch) => ({
    initialSearch: (query) => dispatch({ type: INITIAL_SEARCH, query }),
    search: () => dispatch({ type: SEARCH })
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
