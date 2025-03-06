"use client";

import React from "react";
import Search from "@/app/stillinger/_components/Search";
import { QueryProvider } from "@/app/stillinger/_components/QueryProvider";
import FilterAggregations from "@/app/stillinger/_types/FilterAggregations";
import { Postcode } from "@/app/stillinger/_utils/fetchPostcodes";
import { SearchResult } from "@/app/stillinger/_types/SearchResult";
import { FetchError } from "@/app/stillinger/_utils/fetchTypes";
import { SearchLocation } from "@/app/stillinger/page";

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
