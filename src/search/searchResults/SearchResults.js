import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SearchResultItem from './SearchResultsItem';
import SearchResultsCount from './SearchResultsCount';
import NoResults from '../noResults/NoResults';

function SearchResults({ searchResult, isSearching, searchResultTotal }) {
    const { stillinger } = searchResult;
    return (
        <div role="region" aria-live="polite">
            <SearchResultsCount />
            {stillinger && stillinger.map((stilling) => (
                <SearchResultItem key={stilling.uuid} stilling={stilling} />
            ))}
            {!isSearching && searchResultTotal === 0 && (
                <NoResults />
            )}
        </div>
    );
}

SearchResults.propTypes = {
    searchResult: PropTypes.shape({
        stillinger: PropTypes.arrayOf(PropTypes.object)
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
