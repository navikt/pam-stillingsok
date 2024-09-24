"use client";

import React, { ReactElement } from "react";
import Search from "@/app/(sok)/_components/Search";
import { SearchQueryProvider } from "@/app/(sok)/_components/SearchQueryProvider";
import SearchResult from "@/app/(sok)/_types/SearchResult";
import FilterAggregations, { LocationFilterAggregation } from "@/app/(sok)/_types/FilterAggregations";
import { Postcode } from "@/app/(sok)/_utils/fetchPostcodes";

interface SearchWrapperProps {
    searchResult: SearchResult;
    aggregations: FilterAggregations;
    locations: LocationFilterAggregation[];
    postcodes: Postcode[];
    resultsPerPage: number;
}

export default function SearchWrapper({
    searchResult,
    aggregations,
    locations,
    postcodes,
    resultsPerPage,
}: SearchWrapperProps): ReactElement {
    return (
        <SearchQueryProvider>
            <Search
                searchResult={searchResult}
                locations={locations}
                aggregations={aggregations}
                postcodes={postcodes}
                resultsPerPage={resultsPerPage}
            />
        </SearchQueryProvider>
    );
}
