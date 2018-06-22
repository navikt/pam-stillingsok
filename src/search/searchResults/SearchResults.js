import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SearchResultItem from './SearchResultsItem';
import SearchResultsCount from './SearchResultsCount';
import Pagination from '../pagination/Pagination';
import NoResults from '../noResults/NoResults';
import { PAGE_SIZE, toUrlQuery } from '../searchReducer';
import { toUrl } from '../url';
import './SearchResults.less';

function SearchResults({
    searchResult, isSearching, restoreFocusToUuid, page, total, urlQuery
}) {
    const { stillinger } = searchResult;
    const totalPages = total / PAGE_SIZE;
    const hasMore = page + 1 < totalPages;
    const count = ((page * PAGE_SIZE) + PAGE_SIZE) > total ? total : (page * PAGE_SIZE) + PAGE_SIZE;
    return (
        <div role="region" aria-labelledby="SearchResultsCount" id="treff" className="SearchResults">
            <div id="SearchResultsCount">
                <SearchResultsCount />
            </div>

            {stillinger && stillinger.map((stilling) => (
                <SearchResultItem
                    key={stilling.uuid}
                    stilling={stilling}
                    urlQuery={urlQuery}
                    shouldFocus={stilling.uuid === restoreFocusToUuid}
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

SearchResults.defaultProps = {
    restoreFocusToUuid: undefined
};

SearchResults.propTypes = {
    searchResult: PropTypes.shape({
        stillinger: PropTypes.arrayOf(PropTypes.object)
    }).isRequired,
    isSearching: PropTypes.bool.isRequired,
    restoreFocusToUuid: PropTypes.string,
    page: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    urlQuery: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
    isSearching: state.search.isSearching,
    searchResult: state.search.searchResult,
    restoreFocusToUuid: state.focus.restoreFocusToUuid,
    page: state.search.page,
    total: state.search.searchResult.total,
    urlQuery: toUrl(toUrlQuery(state))
});

export default connect(mapStateToProps)(SearchResults);
