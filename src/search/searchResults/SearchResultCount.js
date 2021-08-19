import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './SearchResultCount.less';

function SearchResultCount({ searchResult }) {
    if (searchResult) {
        const annonserWord = searchResult.total.value === 1 ? 'annonse' : 'annonser';
        const stillingerWord = searchResult.positioncount === 1 ? 'stilling' : 'stillinger';

        return (
            <h2
                className="SearchResultCount__h3"
                aria-live="polite"
            >
                {searchResult.total.value === 0 ? (
                    "Ingen treff"
                ) : (
                    `Viser ${searchResult.positioncount} ${stillingerWord} i ${searchResult.total.value} ${annonserWord}`
                )}

            </h2>
        );
    }

    return (
        <div />
    );
}

SearchResultCount.defaultProps = {
    searchResult: undefined
};

SearchResultCount.propTypes = {
    searchResult: PropTypes.shape({
        value: PropTypes.number,
        positioncount: PropTypes.number
    })
};

const mapStateToProps = (state) => ({
    searchResult: state.search.searchResult
});


export default connect(mapStateToProps)(SearchResultCount);
