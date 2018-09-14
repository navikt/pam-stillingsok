import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SearchResultItem from './SearchResultsItem';
import SearchResultsItemCompact from './SearchResultsItemCompact';
import Pagination from '../pagination/Pagination';
import NoResults from '../noResults/NoResults';
import { PAGE_SIZE } from '../searchReducer';
import './SearchResults.less';

function SearchResults({
    searchResult, isSearching, page, total, mode
}) {
    const { stillinger } = searchResult;
    const totalPages = total / PAGE_SIZE;
    const hasMore = page + 1 < totalPages;
    const count = ((page * PAGE_SIZE) + PAGE_SIZE) > total ? total : (page * PAGE_SIZE) + PAGE_SIZE;
    return (
        <div role="region" id="treff" className="SearchResults">
            {mode !== 'compact' && stillinger && stillinger.map((stilling) => (
                <SearchResultItem
                    key={stilling.uuid}
                    stilling={stilling}
                />
            ))}

            {mode === 'compact' && stillinger && stillinger.map((stilling) => (
                <SearchResultsItemCompact
                    key={stilling.uuid}
                    stilling={stilling}
                />
            ))}

            {hasMore && (
                <div className="SearchResults__numberOfTotal typo-normal">
                   Viser {count} av {total} treff
                </div>
            )}

            {!isSearching && total === 0 && (
                <NoResults />
            )}

            <div className="SearchResults__end">
                {total > 0 && !isSearching && !hasMore && (
                    <div className="SearchResults__numberOfTotal typo-normal">
                        Viser {count} av {total} treff
                    </div>
                )}
                {hasMore && (
                    <Pagination />
                )}
            </div>

        </div>
    );
}

SearchResults.propTypes = {
    searchResult: PropTypes.shape({
        stillinger: PropTypes.arrayOf(PropTypes.object)
    }).isRequired,
    isSearching: PropTypes.bool.isRequired,
    page: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    mode: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
    isSearching: state.search.isSearching,
    searchResult: state.search.searchResult,
    page: state.search.page,
    total: state.search.searchResult.total,
    mode: state.search.mode
});

export default connect(mapStateToProps)(SearchResults);
