import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SearchResultItem from './SearchResultsItem';
import SearchResultsCount from './SearchResultsCount';
import Pagination from '../pagination/Pagination';
import NoResults from '../noResults/NoResults';
import './SearchResults.less';

function SearchResults({ searchResult, isSearching, searchResultTotal, restoreFocusToUuid }) {
    const { stillinger } = searchResult;
    return (
        <div className="SearchResults" role="region" aria-live="polite">
            <SearchResultsCount />
            {stillinger && stillinger.map((stilling) => (
                <SearchResultItem
                    key={stilling.uuid}
                    stilling={stilling}
                    shouldFocus={stilling.uuid === restoreFocusToUuid}
                />
            ))}
            <Pagination />
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
        stillinger: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object))
    }).isRequired,
    isSearching: PropTypes.bool.isRequired,
    searchResultTotal: PropTypes.number.isRequired,
    restoreFocusToUuid: PropTypes.string
};

const mapStateToProps = (state) => ({
    searchResultTotal: state.search.searchResult.total,
    isSearching: state.search.isSearching,
    searchResult: state.search.searchResult,
    restoreFocusToUuid: state.focus.restoreFocusToUuid
});

export default connect(mapStateToProps)(SearchResults);
