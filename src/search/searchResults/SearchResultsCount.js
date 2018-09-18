import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Undertittel } from 'nav-frontend-typografi';

function SearchResultsCount({ isAtLeastOneSearchDone, count }) {
    if (isAtLeastOneSearchDone) {
        if (count === 0) {
            return (
                <Undertittel
                    className="SearchResultsCount"
                    aria-live="assertive"
                >
                    Ingen treff
                </Undertittel>
            );
        }
        return (
            <Undertittel
                className="SearchResultsCount"
                aria-live="assertive"
            >
                {count} treff
            </Undertittel>
        );
    }
    return (
        <div />
    );
}

SearchResultsCount.propTypes = {
    isAtLeastOneSearchDone: PropTypes.bool.isRequired,
    count: PropTypes.number.isRequired
};

const mapStateToProps = (state) => ({
    isAtLeastOneSearchDone: state.search.isAtLeastOneSearchDone,
    count: state.search.searchResult.total
});


export default connect(mapStateToProps)(SearchResultsCount);
