import React from "react";
import PropTypes from "prop-types";
import { BodyShort } from "@navikt/ds-react";
import { formatNumber } from "../../../../common/utils/utils";

function SearchResultCount({ searchResult }) {
    if (searchResult) {
        const annonserWord = searchResult.totalAds === 1 ? "annonse" : "annonser";
        const stillingerWord = searchResult.totalPositions === 1 ? "stilling" : "stillinger";

        return (
            <BodyShort role="status">
                {searchResult.totalAds === 0
                    ? "Ingen treff"
                    : `${formatNumber(searchResult.totalPositions)} ${stillingerWord} i ${formatNumber(
                          searchResult.totalAds,
                      )} ${annonserWord}`}
            </BodyShort>
        );
    }

    return <div />;
}

SearchResultCount.defaultProps = {
    searchResult: undefined,
};

SearchResultCount.propTypes = {
    searchResult: PropTypes.shape({
        totalAds: PropTypes.number,
        totalPositions: PropTypes.number,
    }),
};

export default SearchResultCount;
