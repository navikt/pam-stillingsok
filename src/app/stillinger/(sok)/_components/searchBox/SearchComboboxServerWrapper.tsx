import SearchCombobox from "@/app/stillinger/(sok)/_components/searchBox/SearchCombobox";
import { buildSearchComboboxOptions } from "@/app/stillinger/(sok)/_components/searchBox/searchComboboxOptions";
import type { FetchResult } from "@/app/stillinger/(sok)/_utils/fetchTypes";
import type { SearchResult } from "@/app/stillinger/_common/types/SearchResult";
import type { SearchLocation } from "@/app/_common/geografi/locationsMapping";

type SearchComboboxServerWrapperProps = {
    readonly globalAggregationsPromise: Promise<FetchResult<SearchResult>>;
    readonly locationsPromise: Promise<FetchResult<SearchLocation[]>>;
};
async function SearchComboboxServerWrapper({
    globalAggregationsPromise,
    locationsPromise,
}: SearchComboboxServerWrapperProps) {
    const [globalAggregationsResult, locationsResult] = await Promise.all([
        globalAggregationsPromise,
        locationsPromise,
    ]);

    const aggregations = globalAggregationsResult.data?.aggregations;

    if (!aggregations) {
        throw new Error("Søk mangler aggregations");
    }

    const locations = locationsResult.data ?? [];
    const searchBoxOptions = buildSearchComboboxOptions(aggregations, locations);
    return <SearchCombobox options={searchBoxOptions} />;
}

export default SearchComboboxServerWrapper;
