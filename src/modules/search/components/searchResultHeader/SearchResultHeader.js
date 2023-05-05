import React from "react";
import { Heading } from "@navikt/ds-react";
import SearchResultCount from "../searchResult/SearchResultCount";
import Sorting from "../searchResult/Sorting";

function SearchResultHeader({ searchResponse, query, queryDispatch, isFiltersVisible }) {
    return (
        <div className="SearchResultHeader">
            <div className="Search__number-of-hits-and-sorting-wrapper">
                <div className="Search__count container-large">
                    {searchResponse && searchResponse.data && searchResponse.data.totalAds >= 0 && (
                        <div>
                            <Heading level="2" size="small" className="mb-0_25">
                                Søkeresultat
                            </Heading>
                            <SearchResultCount searchResult={searchResponse.data} />
                        </div>
                    )}
                    <Sorting dispatch={queryDispatch} query={query} />
                </div>
            </div>
        </div>
    );
}

export default SearchResultHeader;
