"use client";

import React from "react";
import Search from "@/app/stillinger/(sok)/_components/Search";
import { QueryProvider } from "@/app/stillinger/(sok)/_components/QueryProvider";
import type FilterAggregations from "@/app/stillinger/_common/types/FilterAggregations";
import { type Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import { type SearchResult } from "@/app/stillinger/_common/types/SearchResult";
import { type FetchError } from "@/app/stillinger/(sok)/_utils/fetchTypes";
import { type SearchLocation } from "@/app/_common/geografi/locationsMapping";

type SearchWrapperProps = {
    searchResult: SearchResult;
    aggregations: FilterAggregations;
    locations: readonly SearchLocation[];
    postcodes: readonly Postcode[];
    resultsPerPage: number;
    errors: FetchError[];
};
const SearchWrapper = ({
    searchResult,
    aggregations,
    locations,
    postcodes,
    resultsPerPage,
    errors,
}: SearchWrapperProps) => {
    return (
        <QueryProvider>
            <Search
                searchResult={searchResult}
                locations={locations}
                aggregations={aggregations}
                postcodes={postcodes}
                resultsPerPage={resultsPerPage}
                errors={errors}
            />
        </QueryProvider>
    );
};
export default SearchWrapper;
