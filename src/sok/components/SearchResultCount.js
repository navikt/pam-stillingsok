import React from 'react';
import { connect } from 'react-redux';
import { Undertittel } from 'nav-frontend-typografi';

export function SearchResultCount({isAtLeastOneSearchDone, count}) {
    if (isAtLeastOneSearchDone) {
        if (count === 0) {
            return (
                <div id="search-result-count"><Undertittel>Ingen treff</Undertittel></div>
            );
        }
        return (
            <div id="search-result-count"><Undertittel>{count} treff</Undertittel></div>
        );
    } else {
        return (
            <div/>
        )
    }
}

const mapStateToProps = (state) => ({
    isAtLeastOneSearchDone: state.search.isAtLeastOneSearchDone,
    count: state.search.searchResult.total
});


export default connect(mapStateToProps)(SearchResultCount);