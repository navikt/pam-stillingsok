import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SearchResultItem from './SearchResultsItem';
import SearchResultsCount from './SearchResultsCount';
import Pagination from '../pagination/Pagination';
import NoResults from '../noResults/NoResults';

function SearchResults({ searchResult, isSearching, searchResultTotal }) {
    const { stillinger } = searchResult;
    return (
        <div role="region" aria-live="polite">
            <SearchResultsCount />
            {stillinger && stillinger.map((bucket, index) => (
                <div key={bucket[0].uuid}>
                    {bucket.map((stilling) => (
                        <SearchResultItem key={stilling.uuid} stilling={stilling} />
                    ))}
                    {index === stillinger.length - 1 && (
                        <Pagination />
                    )}
                </div>
            ))}
            {!isSearching && searchResultTotal === 0 && (
                <NoResults />
            )}
        </div>
    );
}

SearchResults.propTypes = {
    searchResult: PropTypes.shape({
        stillinger: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object))
    }).isRequired,
    isSearching: PropTypes.bool.isRequired,
    searchResultTotal: PropTypes.number.isRequired
};

const mapStateToProps = (state) => ({
    searchResultTotal: state.search.searchResult.total,
    isSearching: state.search.isSearching,
    searchResult: state.search.searchResult
});

export default connect(mapStateToProps)(SearchResults);
