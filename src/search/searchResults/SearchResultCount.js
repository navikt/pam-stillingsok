import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Element } from 'nav-frontend-typografi';
import './SearchResultCount.less';

function SearchResultCount({ searchResult }) {
    if (searchResult) {
        const stillingerWord = searchResult.positioncount > 1 ? 'stillinger' : 'stilling';
        const annonserWord = searchResult.total.value > 1 ? 'annonser' : 'annonse';

        return (
            <div className="SearchResultCount">
                <Element className="SearchResultCount__label">Antall stillinger:</Element>
                <span
                    className="SearchResultCount__h3"
                    aria-live="polite"
                    aria-label={`${searchResult.positioncount} ${stillingerWord} i ${searchResult.total.value} ${annonserWord}`}
                >
                    <span className="SearchResultCount__h3__numberOfPositions" aria-hidden={true}
                    >{searchResult.positioncount}</span>
                    {searchResult.total.value > 0 && (
                        <span className="SearchResultCount__h3__count" aria-hidden={true}
                        >({searchResult.total.value} {annonserWord})</span>
                    )}
                </span>
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
        value: PropTypes.number,
        positioncount: PropTypes.number
    })
};

const mapStateToProps = (state) => ({
    searchResult: state.search.searchResult
});


export default connect(mapStateToProps)(SearchResultCount);
