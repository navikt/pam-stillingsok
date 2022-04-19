import React from "react";
import PropTypes from "prop-types";
import "./SearchResultCount.less";

function SearchResultCount({ searchResult }) {
    if (searchResult) {
        const annonserWord = searchResult.total.value === 1 ? "annonse" : "annonser";
        const stillingerWord = searchResult.positioncount === 1 ? "stilling" : "stillinger";

        return (
            <h2 className="SearchResultCount__h2" aria-live="polite">
                {searchResult.total.value === 0
                    ? "Ingen treff"
                    : `Viser ${searchResult.positioncount} ${stillingerWord} i ${searchResult.total.value} ${annonserWord}`}
            </h2>
        );
    }

    return <div />;
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

export default SearchResultCount;
