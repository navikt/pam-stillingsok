import React from "react";
import PropTypes from "prop-types";
import "./SearchResultCount.less";

function SearchResultCount({ searchResult }) {
    if (searchResult) {
        const annonserWord = searchResult.totalAds === 1 ? "annonse" : "annonser";
        const stillingerWord = searchResult.totalPositions === 1 ? "stilling" : "stillinger";

        return (
            <h2 className="SearchResultCount__h2" aria-live="polite">
                {searchResult.totalAds === 0
                    ? "Ingen treff"
                    : `Viser ${searchResult.totalPositions} ${stillingerWord} i ${searchResult.totalAds} ${annonserWord}`}
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
        totalAds: PropTypes.number,
        totalPositions: PropTypes.number
    })
};

export default SearchResultCount;
