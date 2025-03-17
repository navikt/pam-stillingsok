"use client";

import React from "react";
import Search from "@/app/stillinger/(sok)/_components/Search";
import { QueryProvider } from "@/app/stillinger/(sok)/_components/QueryProvider";
import FilterAggregations from "@/app/stillinger/_common/types/FilterAggregations";
import { Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import { SearchResult } from "@/app/stillinger/_common/types/SearchResult";
import { FetchError } from "@/app/stillinger/(sok)/_utils/fetchTypes";
import { SearchLocation } from "@/app/stillinger/(sok)/page";
import useIsDebug from "@/app/stillinger/(sok)/_components/IsDebugProvider";

type SearchWrapperProps = {
    searchResult: SearchResult;
    aggregations: FilterAggregations;
    locations: SearchLocation[];
    postcodes: Postcode[];
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
    const { isDebug } = useIsDebug();

    return (
        <QueryProvider>
            {isDebug && <div>Results per page - {resultsPerPage}</div>}
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
