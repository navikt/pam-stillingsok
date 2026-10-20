import type { SearchLocation } from "@/app/_common/geografi/locationsMapping";
import type FilterAggregations from "@/app/stillinger/_common/types/FilterAggregations";
import type { SearchResult } from "@/app/stillinger/_common/types/SearchResult";
import FiltersMobile from "@/app/stillinger/(sok)/_components/filters/FiltersMobile";
import type { Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import type { FetchError, FetchResult } from "@/app/stillinger/(sok)/_utils/fetchTypes";

type MobileFiltersLoaderProps = {
    readonly searchResultPromise: Promise<FetchResult<SearchResult>>;
    readonly aggregations: FilterAggregations;
    readonly locations: readonly SearchLocation[];
    readonly postcodes: readonly Postcode[];
    readonly errors: readonly FetchError[];
};

export default async function MobileFiltersLoader({
    searchResultPromise,
    aggregations,
    locations,
    postcodes,
    errors,
}: MobileFiltersLoaderProps) {
    const searchResult = await searchResultPromise;

    if (!searchResult.data) {
        throw new Error("Søk mangler data");
    }

    const combinedErrors = [...errors, ...(searchResult.errors ?? [])];

    return (
        <FiltersMobile
            searchResult={searchResult.data}
            aggregations={aggregations}
            locations={locations}
            postcodes={postcodes}
            errors={combinedErrors}
        />
    );
}
