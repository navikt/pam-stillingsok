import React from "react";
import Search from "@/app/stillinger/(sok)/_components/Search";
import { type FetchResult } from "@/app/stillinger/(sok)/_utils/fetchTypes";
import { type SearchResult } from "@/app/stillinger/_common/types/SearchResult";
import { type SearchLocation } from "@/app/_common/geografi/locationsMapping";
import { type Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";

type SearchContentSectionProps = {
    readonly searchResultPromise: Promise<FetchResult<SearchResult>>;
    readonly globalAggregationsPromise: Promise<FetchResult<SearchResult>>;
    readonly locationsPromise: Promise<FetchResult<SearchLocation[]>>;
    readonly postcodesPromise: Promise<FetchResult<Postcode[]>>;
    readonly resultsPerPage: number;
};

export default async function SearchContentSection({
    searchResultPromise,
    globalAggregationsPromise,
    locationsPromise,
    postcodesPromise,
    resultsPerPage,
}: SearchContentSectionProps) {
    const [searchResultResult, globalAggregationsResult, locationsResult, postcodesResult] = await Promise.all([
        searchResultPromise,
        globalAggregationsPromise,
        locationsPromise,
        postcodesPromise,
    ]);

    const searchResult = searchResultResult.data;
    const aggregations = globalAggregationsResult.data?.aggregations;

    if (!searchResult) {
        throw new Error("Søk mangler data");
    }

    if (!aggregations) {
        throw new Error("Søk mangler aggregations");
    }

    const locations = locationsResult.data ?? [];
    const postcodes = postcodesResult.data ?? [];

    const errors = [
        ...(searchResultResult.errors ?? []),
        ...(globalAggregationsResult.errors ?? []),
        ...(locationsResult.errors ?? []),
        ...(postcodesResult.errors ?? []),
    ];

    return (
        <Search
            searchResult={searchResult}
            aggregations={aggregations}
            locations={locations}
            postcodes={postcodes}
            resultsPerPage={resultsPerPage}
            errors={errors}
        />
    );
}
