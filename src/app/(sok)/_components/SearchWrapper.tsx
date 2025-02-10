"use client";

import React from "react";
import Search from "@/app/(sok)/_components/Search";
import { QueryProvider } from "@/app/(sok)/_components/QueryProvider";
import FilterAggregations from "@/app/(sok)/_types/FilterAggregations";
import { Postcode } from "@/app/(sok)/_utils/fetchPostcodes";
import { SearchResult } from "@/app/(sok)/_types/SearchResult";
import { FetchError } from "@/app/(sok)/_utils/fetchTypes";
import { SearchLocation } from "@/app/(sok)/page";

type SearchWrapperProps = {
    // eslint-disable-next-line
    aiSearchData: any;
    searchResult: SearchResult;
    aggregations: FilterAggregations;
    locations: SearchLocation[];
    postcodes: Postcode[];
    resultsPerPage: number;
    errors: FetchError[];
};
const SearchWrapper = ({
    aiSearchData,
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
                aiSearchData={aiSearchData}
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
