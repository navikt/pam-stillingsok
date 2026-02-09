"use client";

import React, { useContext } from "react";
import { QueryProvider } from "@/app/stillinger/(sok)/_components/QueryProvider";
import type FilterAggregations from "@/app/stillinger/_common/types/FilterAggregations";
import { type Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import { type SearchResult } from "@/app/stillinger/_common/types/SearchResult";
import { type FetchError } from "@/app/stillinger/(sok)/_utils/fetchTypes";
import { type SearchLocation } from "@/app/stillinger/(sok)/page";
import {
    AuthenticationContext,
    MuligheterAccessStatus,
} from "@/app/stillinger/_common/auth/contexts/AuthenticationProvider";
import LoadingPage from "@/app/min-side/_common/components/LoadingPage";
import InternalSearch from "@/app/muligheter/(sok)/InternalSearch";
import { notFound } from "next/navigation";

type SearchWrapperProps = {
    searchResult: SearchResult;
    aggregations: FilterAggregations;
    locations: SearchLocation[];
    postcodes: Postcode[];
    resultsPerPage: number;
    errors: FetchError[];
    removeStuffForTest: boolean;
};
const InternalSearchWrapper = ({
    searchResult,
    aggregations,
    locations,
    postcodes,
    resultsPerPage,
    errors,
    removeStuffForTest = false,
}: SearchWrapperProps) => {
    const { muligheterAccessStatus } = useContext(AuthenticationContext);

    if (
        muligheterAccessStatus === MuligheterAccessStatus.NOT_FETCHED ||
        muligheterAccessStatus === MuligheterAccessStatus.IS_FETCHING
    ) {
        return <LoadingPage />;
    } else if (
        muligheterAccessStatus === MuligheterAccessStatus.FAILURE ||
        muligheterAccessStatus === MuligheterAccessStatus.MULIGHETER_NO_ACCESS
    ) {
        notFound();
    }

    return (
        <QueryProvider>
            <InternalSearch
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
export default InternalSearchWrapper;
