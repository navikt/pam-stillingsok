"use client";

import React from "react";
import Search from "@/app/(nonce)/stillinger/(sok)/_components/Search";
import { QueryProvider } from "@/app/(nonce)/stillinger/(sok)/_components/QueryProvider";
import type FilterAggregations from "@/app/(nonce)/stillinger/_common/types/FilterAggregations";
import { type Postcode } from "@/app/(nonce)/stillinger/(sok)/_utils/fetchPostcodes";
import { type SearchResult } from "@/app/(nonce)/stillinger/_common/types/SearchResult";
import { type FetchError } from "@/app/(nonce)/stillinger/(sok)/_utils/fetchTypes";
import { type SearchLocation } from "@/app/(nonce)/stillinger/(sok)/page";

type SearchWrapperProps = {
    searchResult: SearchResult;
    aggregations: FilterAggregations;
    locations: SearchLocation[];
    postcodes: Postcode[];
    resultsPerPage: number;
    errors: FetchError[];
    removeStuffForTest: boolean;
};
const SearchWrapper = ({
    searchResult,
    aggregations,
    locations,
    postcodes,
    resultsPerPage,
    errors,
    removeStuffForTest = false,
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
                removeStuffForTest={removeStuffForTest}
            />
        </QueryProvider>
    );
};
export default SearchWrapper;
