import React from "react";
import PropTypes from "prop-types";
import "./SearchResultCount.css";
import { BodyShort } from "@navikt/ds-react";

function SearchResultCount({ searchResult }) {
    if (searchResult) {
        const annonserWord = searchResult.totalAds === 1 ? "annonse" : "annonser";
        const stillingerWord = searchResult.totalPositions === 1 ? "stilling" : "stillinger";

        return (
            <BodyShort className="SearchResultCount" role="status">
                {searchResult.totalAds === 0
                    ? "Ingen treff"
                    : `${searchResult.totalPositions} ${stillingerWord} i ${searchResult.totalAds} ${annonserWord}`}
            </BodyShort>
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
