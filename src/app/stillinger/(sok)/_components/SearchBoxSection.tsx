import React from "react";
import SearchBox from "@/app/stillinger/(sok)/_components/searchBox/SearchBox";
import { type FetchResult } from "@/app/stillinger/(sok)/_utils/fetchTypes";
import { type SearchResult } from "@/app/stillinger/_common/types/SearchResult";
import { type SearchLocation } from "@/app/_common/geografi/locationsMapping";
import { type Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import { toSavedSearchUrlSearchParams } from "@/app/stillinger/(sok)/_components/searchBox/searchParamsUtils";
import { UrlSearchParams } from "@/types/routing";

type SearchBoxSectionProps = {
    readonly globalAggregationsPromise: Promise<FetchResult<SearchResult>>;
    readonly locationsPromise: Promise<FetchResult<SearchLocation[]>>;
    readonly postcodesPromise: Promise<FetchResult<Postcode[]>>;
    searchParams: UrlSearchParams;
};

export default async function SearchBoxSection({
    globalAggregationsPromise,
    locationsPromise,
    postcodesPromise,
    searchParams,
}: SearchBoxSectionProps) {
    const urlSearchParams = toSavedSearchUrlSearchParams(searchParams);

    return (
        <SearchBox
            globalAggregationsPromise={globalAggregationsPromise}
            locationsPromise={locationsPromise}
            postcodesPromise={postcodesPromise}
            searchParams={urlSearchParams}
            savedSearchParams={urlSearchParams}
        />
    );
}
