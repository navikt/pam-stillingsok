import React from "react";
import { BodyShort, Box, Heading, HStack, VStack } from "@navikt/ds-react";
import LoggedInButtons from "@/app/stillinger/(sok)/_components/loggedInButtons/LoggedInButtons";
import { type Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import type { SearchResult } from "@/app/stillinger/_common/types/SearchResult";
import type { SearchLocation } from "@/app/_common/geografi/locationsMapping";
import SearchBoxDrivingDistance from "@/app/stillinger/(sok)/_components/searchBox/SearchBoxDrivingDistance";
import SaveAndResetButton from "@/app/stillinger/(sok)/_components/searchBox/SaveAndResetButton";
import { FetchResult } from "@/app/stillinger/(sok)/_utils/fetchTypes";
import { buildSearchComboboxOptions } from "@/app/stillinger/(sok)/_components/searchBox/searchComboboxOptions";
import SearchCombobox from "@/app/stillinger/(sok)/_components/searchBox/SearchCombobox";

type SearchBoxProps = {
    readonly globalAggregationsResult: FetchResult<SearchResult>;
    readonly locationsResult: FetchResult<SearchLocation[]>;
    readonly postcodesResult: FetchResult<Postcode[]>;
    readonly searchParams: URLSearchParams;
    readonly savedSearchParams: URLSearchParams;
};

export default function SearchBox({
    globalAggregationsResult,
    locationsResult,
    postcodesResult,
    searchParams,
    savedSearchParams,
}: SearchBoxProps) {
    const aggregations = globalAggregationsResult.data?.aggregations;

    if (!aggregations) {
        throw new Error("Søk mangler aggregations");
    }

    const locations = locationsResult.data ?? [];
    const searchBoxOptions = buildSearchComboboxOptions(aggregations, locations);

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
                    <LoggedInButtons />
                </HStack>

                <BodyShort className="mb-4">
                    <AkselNextLink href="/slik-bruker-du-det-nye-soket">
                        Slik bruker du søket for best resultat
                    </AkselNextLink>
                </BodyShort>

                <VStack gap="space-12">
                    <SearchCombobox options={searchBoxOptions} />

                    <SearchBoxDrivingDistance searchParams={searchParams} postcodesResult={postcodesResult} />

                    <SaveAndResetButton searchParams={savedSearchParams} />
                </VStack>
            </Box>
        </Box>
    );
}
