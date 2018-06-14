import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SearchResultItem from './SearchResultsItem';
import SearchResultsCount from './SearchResultsCount';
import Pagination from '../pagination/Pagination';
import NoResults from '../noResults/NoResults';
import { PAGE_SIZE } from '../searchReducer';
import './SearchResults.less';

function SearchResults({
    searchResult, isSearching, searchResultTotal, restoreFocusToUuid, from, total
}) {
    const { stillinger } = searchResult;
    const hasMore = (from === undefined && total > PAGE_SIZE) || (from + PAGE_SIZE < total);
    return (
        <div role="region" aria-labelledby="SearchResultsCount" id="treff" className="SearchResults">
            <div id="SearchResultsCount">
                <SearchResultsCount />
            </div>
            {stillinger && stillinger.map((stilling) => (
                <SearchResultItem
                    key={stilling.uuid}
                    stilling={stilling}
                    shouldFocus={stilling.uuid === restoreFocusToUuid}
                />
            ))}
            {hasMore && (
                <Pagination />
            )}
            {!isSearching && searchResultTotal === 0 && (
                <NoResults />
            )}
        </div>
    );
}

SearchResults.defaultProps = {
    restoreFocusToUuid: undefined
};

SearchResults.propTypes = {
    searchResult: PropTypes.shape({
        stillinger: PropTypes.arrayOf(PropTypes.object)
    }).isRequired,
    isSearching: PropTypes.bool.isRequired,
    searchResultTotal: PropTypes.number.isRequired,
    restoreFocusToUuid: PropTypes.string,
    from: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired
};

const mapStateToProps = (state) => ({
    searchResultTotal: state.search.searchResult.total,
    isSearching: state.search.isSearching,
    searchResult: state.search.searchResult,
    restoreFocusToUuid: state.focus.restoreFocusToUuid,
    from: state.search.from,
    total: state.search.searchResult.total
});

export default connect(mapStateToProps)(SearchResults);
