import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Element, Undertittel } from 'nav-frontend-typografi';
import './SearchResultCount.less';

function SearchResultCount({ searchResult }) {
    if (searchResult) {
        const annonserWord = searchResult.total > 1 ? 'annonser' : 'annonse';
        return (
            <div className="SearchResultCount">
                <Element className="SearchResultCount__label">Antall stillinger:</Element>
                <h3
                    className="SearchResultCount__h3"
                    aria-live="polite"
                >
                    <span className="SearchResultCount__h3__numberOfPositions">{searchResult.positioncount}</span>
                    {searchResult.total > 0 && (
                        <span className="SearchResultCount__h3__count">({searchResult.total} {annonserWord})</span>
                    )}
                </h3>
            </div>
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
        total: PropTypes.number,
        positioncount: PropTypes.number
    })
};

const mapStateToProps = (state) => ({
    searchResult: state.search.searchResult
});


export default connect(mapStateToProps)(SearchResultCount);
