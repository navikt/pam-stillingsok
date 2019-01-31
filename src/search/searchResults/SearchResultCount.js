import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Undertittel } from 'nav-frontend-typografi';
import './SearchResultCount.less';

function SearchResultCount({ searchResult }) {
    if (searchResult) {
        const annonserWord = searchResult.total > 1 ? 'annonser' : 'annonse';
        const stillingerWord = searchResult.positioncount > 1 ? 'stillinger' : 'stilling';
        return (
            searchResult.total > 0 ? (
                <Undertittel
                    className="SearchResultCount"
                    aria-live="polite"
                >
                    {searchResult.positioncount} <span className="SearchResultCount__text">{stillingerWord} i </span>
                    {searchResult.total} <span className="SearchResultCount__text">{annonserWord}</span>
                </Undertittel>
            ) : (
                <Undertittel
                    className="SearchResultCount"
                    aria-live="polite"
                >
                    <span className="SearchResultCount__text">Ingen treff</span>
                </Undertittel>
            )
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
