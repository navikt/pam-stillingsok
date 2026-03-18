import React, { Suspense } from "react";
import { BodyShort, Box, Heading, HStack, Skeleton, VStack } from "@navikt/ds-react";
import LoggedInButtons from "@/app/stillinger/(sok)/_components/loggedInButtons/LoggedInButtons";
import { type Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import SearchComboboxServerWrapper from "@/app/stillinger/(sok)/_components/searchBox/SearchComboboxServerWrapper";
import type { FetchResult } from "@/app/stillinger/(sok)/_utils/fetchTypes";
import type { SearchResult } from "@/app/stillinger/_common/types/SearchResult";
import type { SearchLocation } from "@/app/_common/geografi/locationsMapping";
import SearchBoxDrivingDistance from "@/app/stillinger/(sok)/_components/searchBox/SearchBoxDrivingDistance";
import SaveAndResetButton from "@/app/stillinger/(sok)/_components/searchBox/SaveAndResetButton";

type SearchBoxProps = {
    readonly globalAggregationsPromise: Promise<FetchResult<SearchResult>>;
    readonly locationsPromise: Promise<FetchResult<SearchLocation[]>>;
    readonly postcodesPromise: Promise<FetchResult<Postcode[]>>;
    readonly searchParams: URLSearchParams;
    readonly savedSearchParams: URLSearchParams;
};

export default function SearchBox({
    globalAggregationsPromise,
    locationsPromise,
    postcodesPromise,
    searchParams,
    savedSearchParams,
}: SearchBoxProps) {
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
                    <Suspense
                        fallback={
                            <VStack gap="space-8">
                                <Skeleton variant="text" width="318px" />
                                <Skeleton variant="rounded" width="100%" height={48} />
                            </VStack>
                        }
                    >
                        <SearchComboboxServerWrapper
                            globalAggregationsPromise={globalAggregationsPromise}
                            locationsPromise={locationsPromise}
                        />
                    </Suspense>

                    <Suspense fallback={null}>
                        <SearchBoxDrivingDistance searchParams={searchParams} postcodesPromise={postcodesPromise} />
                    </Suspense>

                    <SaveAndResetButton searchParams={savedSearchParams} />
                </VStack>
            </Box>
        </Box>
    );
}
