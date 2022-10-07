import React from "react";
import PropTypes from "prop-types";
import "./SearchResultCount.less";

function SearchResultCount({ searchResult }) {
    if (searchResult) {
        const annonserWord = searchResult.totalAds === 1 ? "annonse" : "annonser";
        const stillingerWord = searchResult.totalPositions === 1 ? "stilling" : "stillinger";

        return (
            <p className="SearchResultCount" role="status">
                {searchResult.totalAds === 0
                    ? "Ingen treff"
                    : `${searchResult.totalPositions} ${stillingerWord} i ${searchResult.totalAds} ${annonserWord}`}
            </p>
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
