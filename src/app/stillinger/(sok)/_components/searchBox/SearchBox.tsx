import { Box, Heading, HStack, Show, Skeleton, VStack } from "@navikt/ds-react";
import { Suspense } from "react";
import type { SearchLocation } from "@/app/_common/geografi/locationsMapping";
import type { SearchResult } from "@/app/stillinger/_common/types/SearchResult";
import MobileActiveFilters from "@/app/stillinger/(sok)/_components/searchBox/MobileActiveFilters";
import MobileFiltersLoader from "@/app/stillinger/(sok)/_components/searchBox/MobileFiltersLoader";
import SearchBoxDrivingDistance from "@/app/stillinger/(sok)/_components/searchBox/SearchBoxDrivingDistance";
import SearchBoxSaveSearchButton from "@/app/stillinger/(sok)/_components/searchBox/SearchBoxSaveSearchButton";
import SearchCombobox from "@/app/stillinger/(sok)/_components/searchBox/SearchCombobox";
import { buildSearchComboboxOptions } from "@/app/stillinger/(sok)/_components/searchBox/searchComboboxOptions";
import type { Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import type { FetchResult } from "@/app/stillinger/(sok)/_utils/fetchTypes";

type SearchBoxProps = {
    readonly globalAggregationsResult: FetchResult<SearchResult>;
    readonly locationsResult: FetchResult<SearchLocation[]>;
    readonly postcodesResult: FetchResult<Postcode[]>;
    readonly searchResultPromise: Promise<FetchResult<SearchResult>>;
    readonly searchParams: URLSearchParams;
    readonly savedSearchParams: URLSearchParams;
};

function MobileFilterButtonSkeleton() {
    return <Skeleton variant="rounded" width={104} height={48} />;
}

export default function SearchBox({
    globalAggregationsResult,
    locationsResult,
    postcodesResult,
    searchResultPromise,
    searchParams,
    savedSearchParams,
}: SearchBoxProps) {
    const aggregations = globalAggregationsResult.data?.aggregations;

    if (!aggregations) {
        throw new Error("Søk mangler aggregations");
    }

    const locations = locationsResult.data ?? [];
    const postcodes = postcodesResult.data ?? [];
    const searchBoxOptions = buildSearchComboboxOptions(aggregations, locations);

    const mobileFiltersErrors = [
        ...(globalAggregationsResult.errors ?? []),
        ...(locationsResult.errors ?? []),
        ...(postcodesResult.errors ?? []),
    ];

    return (
        <Box paddingBlock={{ xs: "space-0 space-24", lg: "space-40 space-48" }}>
            <Box
                paddingInline={{ xs: "space-16", md: "space-32" }}
                paddingBlock={{ xs: "space-16", md: "space-24" }}
                borderRadius={{ lg: "8" }}
                maxWidth={{ lg: "800px" }}
                className="search-container bg-brand-green-subtle"
            >
                <HStack justify="space-between" align="center" className="mb-1">
                    <Heading level="1" size="large">
                        Søk etter jobber
                    </Heading>

                    <Show above="sm">
                        <SearchBoxSaveSearchButton searchParams={savedSearchParams} />
                    </Show>
                </HStack>

                <VStack gap="space-12">
                    <SearchCombobox options={searchBoxOptions} />

                    <Show below="lg">
                        <VStack gap="space-28">
                            <HStack gap="space-4" justify="space-between" align="center">
                                <Suspense fallback={<MobileFilterButtonSkeleton />}>
                                    <MobileFiltersLoader
                                        searchResultPromise={searchResultPromise}
                                        aggregations={aggregations}
                                        locations={locations}
                                        postcodes={postcodes}
                                        errors={mobileFiltersErrors}
                                    />
                                </Suspense>

                                <Show below="sm">
                                    <SearchBoxSaveSearchButton searchParams={savedSearchParams} />
                                </Show>
                            </HStack>

                            <MobileActiveFilters />
                        </VStack>
                    </Show>

                    <SearchBoxDrivingDistance searchParams={searchParams} postcodesResult={postcodesResult} />
                </VStack>
            </Box>
        </Box>
    );
}
