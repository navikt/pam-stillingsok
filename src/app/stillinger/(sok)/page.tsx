import React, { Suspense } from "react";
import { after } from "next/server";
import { z } from "zod";
import { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { BodyShort, Box, Heading, HGrid, HStack, Skeleton, Stack, VStack } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/Page";

import { createQuery, SEARCH_CHUNK_SIZE, type SearchQuery, toApiQuery } from "@/app/stillinger/(sok)/_utils/query";
import {
    fetchCachedSearchAggregations,
    fetchCachedSimplifiedElasticSearch,
} from "@/app/stillinger/(sok)/_utils/fetchElasticSearch";
import { fetchCachedPostcodes } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import { logTextSearch } from "@/app/stillinger/_common/monitoring/search-logging";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import {
    FETCH_FYLKER_ERROR,
    FETCH_KOMMUNER_ERROR,
    type FetchError,
    type FetchResult,
} from "@/app/stillinger/(sok)/_utils/fetchTypes";
import MaxQuerySizeExceeded from "@/app/stillinger/(sok)/_components/maxQuerySizeExceeded/MaxQuerySizeExceeded";
import { appLogger } from "@/app/_common/logging/appLogger";
import { type UrlSearchParams } from "@/types/routing";
import { type SearchLocation } from "@/app/_common/geografi/locationsMapping";

import SearchPageClientShell from "@/app/stillinger/(sok)/_components/SearchPageClientShell";
import SearchBoxSection from "@/app/stillinger/(sok)/_components/SearchBoxSection";
import SearchContentSection from "@/app/stillinger/(sok)/_components/SearchContentSection";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";

const MAX_QUERY_SIZE = 10000;

export const metadata: Metadata = {
    title: "Ledige stillinger",
    description: "Søk etter ledige jobber. Her har vi samlet ledige stillinger fra hele Norge.",
};

type KommuneRaw = {
    readonly kommunenummer: string;
    readonly navn: string;
    readonly fylkesnummer: string;
    readonly korrigertNavn: string;
};

type FylkeRaw = {
    readonly fylkesnummer: string;
    readonly navn: string;
    readonly korrigertNavn: string;
};

const fetchCachedLocations = unstable_cache(
    async (): Promise<FetchResult<SearchLocation[]>> => {
        const headers = await getDefaultHeaders();
        headers.set("Nav-CallId", "");

        return fetchLocations(headers);
    },
    ["locations-query-v2"],
    { revalidate: 60 * 60 * 24 },
);

async function fetchLocations(headers: HeadersInit): Promise<FetchResult<SearchLocation[]>> {
    const [kommunerRespons, fylkerRespons] = await Promise.all([
        fetch(`${process.env.PAM_GEOGRAFI_API_URL}/kommuner`, { headers }),
        fetch(`${process.env.PAM_GEOGRAFI_API_URL}/fylker`, { headers }),
    ]);

    const errors: FetchError[] = [];

    if (!kommunerRespons.ok) {
        appLogger.httpError(`Feilet å hente kommuner`, {
            method: "GET",
            url: kommunerRespons.url,
            status: kommunerRespons.status,
            statusText: kommunerRespons.statusText,
        });
        errors.push({ type: FETCH_KOMMUNER_ERROR });
    }

    if (!fylkerRespons.ok) {
        appLogger.httpError(`Feilet å hente fylker`, {
            method: "GET",
            url: fylkerRespons.url,
            status: fylkerRespons.status,
            statusText: fylkerRespons.statusText,
        });
        errors.push({ type: FETCH_FYLKER_ERROR });
    }

    if (errors.length > 0) {
        return {
            errors,
            data: [],
        };
    }

    const municipals: KommuneRaw[] = await kommunerRespons.json();
    const counties: FylkeRaw[] = await fylkerRespons.json();

    return {
        data: [
            ...counties.map((county) => ({
                key: county.navn,
                code: county.fylkesnummer,
                label: county.korrigertNavn,
                municipals: municipals
                    .filter((municipal) => municipal.fylkesnummer === county.fylkesnummer)
                    .map((municipal) => ({
                        key: `${county.navn}.${municipal.navn}`,
                        label: municipal.korrigertNavn,
                        code: municipal.fylkesnummer,
                    })),
            })),
            {
                key: "UTLAND",
                code: "999",
                label: "Utland",
                municipals: [],
            },
        ],
    };
}

type PageProps = {
    readonly searchParams: Promise<UrlSearchParams>;
};

const NON_FILTER_QUERY_NAMES = new Set<string>([QueryNames.URL_VERSION, "from", "pageCount", "sort", "locked"]);

function hasSearchParamValue(value: unknown): boolean {
    if (Array.isArray(value)) {
        return value.some((entry) => typeof entry === "string" && entry.length > 0);
    }

    if (typeof value === "string") {
        return value.length > 0;
    }

    return false;
}

function hasFilterAffectingParams(searchParams: UrlSearchParams): boolean {
    return Object.entries(searchParams).some(([name, value]) => {
        if (NON_FILTER_QUERY_NAMES.has(name)) {
            return false;
        }

        return hasSearchParamValue(value);
    });
}

function parseResultsPerPage(searchParams: UrlSearchParams): number {
    const pageCountSchema = z.coerce.number().int().min(1).max(100);
    const candidate = Array.isArray(searchParams.pageCount) ? searchParams.pageCount[0] : searchParams.pageCount;
    const parsed = pageCountSchema.safeParse(candidate);

    if (parsed.success) {
        return parsed.data;
    }

    return SEARCH_CHUNK_SIZE;
}

function parseFrom(searchParams: UrlSearchParams) {
    const rawFrom = Array.isArray(searchParams.from) ? searchParams.from[0] : searchParams.from;

    return z.coerce
        .number()
        .int()
        .min(0)
        .safeParse(rawFrom ?? 0);
}
function SearchBoxFallback() {
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
                    <>
                        <Skeleton variant="rounded" width={136} height={29} />
                        <Skeleton variant="rounded" width={136} height={29} />
                    </>
                </HStack>

                <BodyShort className="mb-4">
                    <AkselNextLink href="/slik-bruker-du-det-nye-soket">
                        Slik bruker du søket for best resultat
                    </AkselNextLink>
                </BodyShort>

                <VStack gap="space-12">
                    <Skeleton variant="text" width="220px" height={31} />
                    <Skeleton variant="rounded" width="100%" height={56} />

                    <HStack gap="space-8" align="center" justify="end">
                        <>
                            <Skeleton variant="rounded" width={136} height={29} />
                            <Skeleton variant="rounded" width={136} height={29} />
                        </>
                    </HStack>
                </VStack>
            </Box>
        </Box>
    );
}

function SearchContentFallback() {
    return (
        <Box className="bg-alt-1-subtle-on-lg" paddingBlock={{ lg: "space-16" }}>
            <PageBlock as="section" width="xl" gutters>
                <HGrid
                    columns={{ xs: 1, lg: "220px auto", xl: "370px auto" }}
                    gap={{ xs: "space-0", lg: "space-24", xl: "space-48" }}
                >
                    <div />
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        justify={{ md: "space-between" }}
                        align={{ sm: "start", md: "center" }}
                        gap="space-16 space-32"
                        wrap={false}
                    >
                        <HStack
                            gap="space-8"
                            wrap={false}
                            justify="space-between"
                            align="center"
                            className="full-width"
                        >
                            <VStack gap="space-8">
                                <Skeleton variant="rounded" width={136} height={22} />

                                <Skeleton variant="rounded" width={136} height={22} />
                            </VStack>

                            <HStack gap="space-8" align="center" wrap={false}>
                                <Skeleton variant="rectangle" width={136} height={29} />
                            </HStack>
                        </HStack>
                    </Stack>
                </HGrid>
            </PageBlock>
        </Box>
    );
}

export default async function Page(props: PageProps) {
    const searchParams = await props.searchParams;
    const resultsPerPage = parseResultsPerPage(searchParams);
    const parsedFrom = parseFrom(searchParams);

    if (!parsedFrom.success) {
        appLogger.warn("Avviser ugyldig from for stillingssøk", {
            component: "SearchPage",
            rawFrom: Array.isArray(searchParams.from) ? searchParams.from[0] : searchParams.from,
            resultsPerPage,
        });

        return <MaxQuerySizeExceeded goBackToSearchUrl="/stillinger" />;
    }

    if (parsedFrom.data + resultsPerPage > MAX_QUERY_SIZE) {
        appLogger.warn("Avviser for dyp paginering for stillingssøk", {
            component: "SearchPage",
            from: parsedFrom.data,
            rawFrom: Array.isArray(searchParams.from) ? searchParams.from[0] : searchParams.from,
            resultsPerPage,
            sort: Array.isArray(searchParams.sort) ? searchParams.sort[0] : searchParams.sort,
            version: Array.isArray(searchParams.v) ? searchParams.v[0] : searchParams.v,
        });

        return <MaxQuerySizeExceeded goBackToSearchUrl="/stillinger" />;
    }

    after(async () => {
        await logTextSearch(searchParams);
    });

    const currentSearchQuery: SearchQuery = createQuery({
        ...searchParams,
        size: resultsPerPage.toString(),
    });

    const baselineAggregationsQuery: SearchQuery = createQuery({
        size: "0",
    });

    const shouldFetchSeparateBaselineAggregations = hasFilterAffectingParams(searchParams);

    const searchResultPromise = fetchCachedSimplifiedElasticSearch(toApiQuery(currentSearchQuery));
    const globalAggregationsPromise = shouldFetchSeparateBaselineAggregations
        ? fetchCachedSearchAggregations(toApiQuery(baselineAggregationsQuery))
        : searchResultPromise;

    const locationsPromise = fetchCachedLocations();
    const postcodesPromise = fetchCachedPostcodes();

    return (
        <SearchPageClientShell>
            <Suspense fallback={<SearchBoxFallback />}>
                <SearchBoxSection
                    globalAggregationsPromise={globalAggregationsPromise}
                    locationsPromise={locationsPromise}
                    postcodesPromise={postcodesPromise}
                />
            </Suspense>

            <Suspense fallback={<SearchContentFallback />}>
                <SearchContentSection
                    searchResultPromise={searchResultPromise}
                    globalAggregationsPromise={globalAggregationsPromise}
                    locationsPromise={locationsPromise}
                    postcodesPromise={postcodesPromise}
                    resultsPerPage={resultsPerPage}
                />
            </Suspense>
        </SearchPageClientShell>
    );
}
