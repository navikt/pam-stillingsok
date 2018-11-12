import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Undertittel } from 'nav-frontend-typografi';

function SearchResultCount({ searchResult }) {
    if (searchResult) {
        return (
            <Undertittel
                className="SearchResultCount"
                aria-live="polite"
            >
                {searchResult.total > 0 ? `${searchResult.total} treff` : 'Ingen treff'}
            </Undertittel>
        );
    }
    return (
        <div />
    );
}

SearchResultCount.defaultProps = {
    searchResult: undefined
}

SearchResultCount.propTypes = {
    searchResult: PropTypes.shape({
        total: PropTypes.number
    })
};

const mapStateToProps = (state) => ({
    searchResult: state.search.searchResult
});


export default connect(mapStateToProps)(SearchResultCount);
