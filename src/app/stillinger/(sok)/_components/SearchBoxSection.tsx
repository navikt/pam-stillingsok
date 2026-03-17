import React from "react";
import SearchBox from "@/app/stillinger/(sok)/_components/searchBox/SearchBox";
import { buildSearchComboboxOptions } from "@/app/stillinger/(sok)/_components/searchBox/searchComboboxOptions";
import { type FetchResult } from "@/app/stillinger/(sok)/_utils/fetchTypes";
import { type SearchResult } from "@/app/stillinger/_common/types/SearchResult";
import { type SearchLocation } from "@/app/_common/geografi/locationsMapping";
import { type Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";

type SearchBoxSectionProps = {
    readonly globalAggregationsPromise: Promise<FetchResult<SearchResult>>;
    readonly locationsPromise: Promise<FetchResult<SearchLocation[]>>;
    readonly postcodesPromise: Promise<FetchResult<Postcode[]>>;
};

export default async function SearchBoxSection({
    globalAggregationsPromise,
    locationsPromise,
    postcodesPromise,
}: SearchBoxSectionProps) {
    const [globalAggregationsResult, locationsResult, postcodesResult] = await Promise.all([
        globalAggregationsPromise,
        locationsPromise,
        postcodesPromise,
    ]);

    const aggregations = globalAggregationsResult.data?.aggregations;

    if (!aggregations) {
        throw new Error("Søk mangler aggregations");
    }

    const locations = locationsResult.data ?? [];
    const postcodes = postcodesResult.data ?? [];
    const searchBoxOptions = buildSearchComboboxOptions(aggregations, locations);

    return <SearchBox options={searchBoxOptions} postcodes={postcodes} />;
}
