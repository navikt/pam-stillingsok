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
    ValidJobSeekerStatus,
} from "@/app/stillinger/_common/auth/contexts/AuthenticationProvider";
import NotFoundPage from "@/app/_common/components/NotFoundPage";
import LoadingPage from "@/app/min-side/_common/components/LoadingPage";
import InternalSearch from "@/app/muligheter/(sok)/InternalSearch";

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
    const { validJobSeekerStatus } = useContext(AuthenticationContext);

    if (
        validJobSeekerStatus === ValidJobSeekerStatus.NOT_FETCHED ||
        validJobSeekerStatus === ValidJobSeekerStatus.IS_FETCHING
    ) {
        return <LoadingPage />;
    } else if (
        validJobSeekerStatus === ValidJobSeekerStatus.FAILURE ||
        validJobSeekerStatus === ValidJobSeekerStatus.IS_NOT_VALID_JOB_SEEKER
    ) {
        return (
            <NotFoundPage title="Krever innlogging" text="Denne siden krever innlogging. Logg inn og prøv på nytt." />
        );
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
