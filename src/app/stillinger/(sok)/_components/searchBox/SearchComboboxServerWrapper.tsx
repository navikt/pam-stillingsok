import SearchCombobox from "@/app/stillinger/(sok)/_components/searchBox/SearchCombobox";
import { buildSearchComboboxOptions } from "@/app/stillinger/(sok)/_components/searchBox/searchComboboxOptions";
import type { SearchResult } from "@/app/stillinger/_common/types/SearchResult";
import type { SearchLocation } from "@/app/_common/geografi/locationsMapping";
import { FetchResult } from "@/app/stillinger/(sok)/_utils/fetchTypes";

type SearchComboboxServerWrapperProps = {
    readonly globalAggregationsResult: FetchResult<SearchResult>;
    readonly locationsResult: FetchResult<SearchLocation[]>;
};
async function SearchComboboxServerWrapper({
    globalAggregationsResult,
    locationsResult,
}: SearchComboboxServerWrapperProps) {
    const aggregations = globalAggregationsResult.data?.aggregations;

    if (!aggregations) {
        throw new Error("Søk mangler aggregations");
    }

    //const locations = locationsResult.data ?? [];
    const locations = locationsResult.data ?? [];
    const searchBoxOptions = buildSearchComboboxOptions(aggregations, locations);

    return <SearchCombobox options={searchBoxOptions} />;
}

export default SearchComboboxServerWrapper;
