import React from "react";
import Search from "@/app/stillinger/(sok)/_components/Search";
import { type FetchResult } from "@/app/stillinger/(sok)/_utils/fetchTypes";
import { type SearchResult } from "@/app/stillinger/_common/types/SearchResult";
import { type SearchLocation } from "@/app/_common/geografi/locationsMapping";
import { type Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";

type SearchContentSectionProps = {
    readonly searchResultPromise: Promise<FetchResult<SearchResult>>;
    readonly globalAggregationsResult: FetchResult<SearchResult>;
    readonly locationsResult: FetchResult<SearchLocation[]>;
    readonly postcodesResult: FetchResult<Postcode[]>;
    readonly resultsPerPage: number;
};

export default async function SearchContentSection({
    searchResultPromise,
    globalAggregationsResult,
    locationsResult,
    postcodesResult,
    resultsPerPage,
}: SearchContentSectionProps) {
    const searchResult = await Promise.resolve(searchResultPromise);
    const aggregations = globalAggregationsResult.data?.aggregations;

    if (!searchResult.data) {
        throw new Error("Søk mangler data");
    }

    if (!aggregations) {
        throw new Error("Søk mangler aggregations");
    }

    const locations = locationsResult.data ?? [];
    const postcodes = postcodesResult.data ?? [];

    const errors = [
        ...(searchResult.errors ?? []),
        ...(globalAggregationsResult.errors ?? []),
        ...(locationsResult.errors ?? []),
        ...(postcodesResult.errors ?? []),
    ];

    return (
        <Search
            searchResult={searchResult.data}
            aggregations={aggregations}
            locations={locations}
            postcodes={postcodes}
            resultsPerPage={resultsPerPage}
            errors={errors}
        />
    );
}
