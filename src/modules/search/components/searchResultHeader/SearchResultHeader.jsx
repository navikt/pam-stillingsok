import React from "react";
import { BodyShort, Heading, Skeleton } from "@navikt/ds-react";
import PropTypes from "prop-types";
import SearchResultCount from "../searchResult/SearchResultCount";
import Sorting from "../searchResult/Sorting";

function SearchResultHeader({ searchResponse, query, queryDispatch }) {
    return (
        <div className="SearchResultHeader">
            <div className="Search__number-of-hits-and-sorting-wrapper">
                <div className="Search__count container-large">
                    <div>
                        <Heading level="2" size="small" className="mb-1">
                            Søkeresultat
                        </Heading>
                        {searchResponse && searchResponse.data && searchResponse.data.totalAds >= 0 ? (
                            <SearchResultCount searchResult={searchResponse.data} />
                        ) : (
                            <BodyShort as={Skeleton} width="200px" />
                        )}
                    </div>
                    <Sorting dispatch={queryDispatch} query={query} />
                </div>
            </div>
        </div>
    );
}

SearchResultHeader.propTypes = {
    searchResponse: PropTypes.shape({
        data: PropTypes.shape({
            totalAds: PropTypes.number,
        }),
    }),
    queryDispatch: PropTypes.func.isRequired,
    query: PropTypes.shape({}),
};

export default SearchResultHeader;
