"use client";

import React, { useEffect, useReducer, useState } from "react";
import PropTypes from "prop-types";
import {
    BodyShort,
    Box,
    Button,
    Heading,
    HGrid,
    Hide,
    HStack,
    Link as AkselLink,
    Show,
    Stack,
    VStack,
} from "@navikt/ds-react";
import { useRouter, useSearchParams } from "next/navigation";
import { InformationSquareIcon, TrashIcon } from "@navikt/aksel-icons";
import SaveSearchButton from "@/app/lagrede-sok/_components/SaveSearchButton";
import fixLocationName from "@/app/_common/utils/fixLocationName";
import queryReducer, { REMOVE_DISTANCE, REMOVE_POSTCODE } from "../_utils/queryReducer";
import { isSearchQueryEmpty, SEARCH_CHUNK_SIZE, stringifyQuery, toBrowserQuery } from "../_utils/query";
import SearchResult from "./searchResult/SearchResult";
import DoYouWantToSaveSearch from "./howToPanels/DoYouWantToSaveSearch";
import Feedback from "./feedback/Feedback";
import FiltersDesktop from "./filters/FiltersDesktop";
import SearchResultHeader from "./searchResultHeader/SearchResultHeader";
import FilterIcon from "./icons/FilterIcon";
import logAmplitudeEvent from "../../_common/monitoring/amplitude";
import LoggedInButtons from "./loggedInButtons/LoggedInButtons";
import FiltersMobile from "./filters/FiltersMobile";
import SearchBox from "./searchBox/SearchBox";
import SearchPagination from "./searchResult/SearchPagination";
import MaxResultsBox from "./searchResult/MaxResultsBox";

export default function Search({ query, searchResult, aggregations, locations, postcodes }) {
    const [updatedQuery, queryDispatch] = useReducer(queryReducer, query);
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    const [initialRenderDone, setInitialRenderDone] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const savedSearchUuid = searchParams.get("saved");

    /**
     * Perform a search when user changes search criteria
     */
    useEffect(() => {
        if (initialRenderDone) {
            const browserQuery = toBrowserQuery(updatedQuery);

            // Keep saved search uuid in browser url, as long as there are some search criteria.
            // This uuid is used when user update an existing saved search
            if (!isSearchQueryEmpty(browserQuery) && savedSearchUuid) {
                browserQuery.saved = savedSearchUuid;
            }

            logAmplitudeEvent("Stillinger - Utførte søk");

            if (updatedQuery.paginate) {
                router.push(`/${stringifyQuery(browserQuery)}`);
            } else {
                router.replace(`/${stringifyQuery(browserQuery)}`, { scroll: false });
            }
        } else {
            // Skip search first time query change, since that
            // will just reload the search result we already got
            setInitialRenderDone(true);
        }
    }, [updatedQuery]);

    useEffect(() => {
        logAmplitudeEvent("Stillinger - Utførte søk");
    }, []);

    function onFormSubmit(e) {
        e.preventDefault();
    }

    const drivingDistanceFilterActive = query.postcode && query.postcode.length === 4 && query.distance > 0;
    const onlyPostcodeOrDistanceFilterActive =
        searchParams.size === 2 && (searchParams.has("postcode") || searchParams.has("distance"));
    const showSaveAndResetButton = searchParams.size > 0 && !onlyPostcodeOrDistanceFilterActive;
    const chosenPostcodeCity = drivingDistanceFilterActive && postcodes.find((p) => p.postcode === query.postcode).city;

    return (
        <form onSubmit={onFormSubmit} className="mb-24">
            <Box paddingBlock={{ xs: "4", md: "10" }} paddingInline={{ xs: "4", sm: "6" }}>
                <Stack justify={{ md: "center" }}>
                    <Heading level="1" size="xlarge">
                        Søk etter din neste jobb
                    </Heading>
                </Stack>
            </Box>

            <Box
                padding={{ xs: "6 4", md: "6 12" }}
                background="surface-alt-1-subtle"
                borderRadius={{ md: "large" }}
                className="SearchContainer"
            >
                <SearchBox
                    query={updatedQuery}
                    dispatch={queryDispatch}
                    aggregations={aggregations}
                    locations={locations}
                />

                {drivingDistanceFilterActive && (
                    <HStack align="center" wrap={false} gap="2">
                        <HStack gap="2">
                            <BodyShort weight="semibold">Reisevei:</BodyShort>
                            <BodyShort>
                                Innen {query.distance} km fra {query.postcode} {fixLocationName(chosenPostcodeCity)}
                            </BodyShort>
                        </HStack>
                        <Button
                            type="button"
                            variant="tertiary"
                            onClick={() => {
                                queryDispatch({ type: REMOVE_POSTCODE });
                                queryDispatch({ type: REMOVE_DISTANCE });
                            }}
                            icon={<TrashIcon aria-hidden="true" />}
                            size="small"
                        >
                            Fjern
                        </Button>
                    </HStack>
                )}
                <HStack className="mt-3" gap="2" columns="2" align="baseline">
                    <div>
                        {showSaveAndResetButton && (
                            <>
                                <SaveSearchButton query={query} size="small" />
                                <Button
                                    type="button"
                                    variant="tertiary"
                                    onClick={() => {
                                        queryDispatch({ type: "RESET" });
                                    }}
                                    icon={<TrashIcon aria-hidden="true" />}
                                    size="small"
                                >
                                    Nullstill søk
                                </Button>
                            </>
                        )}
                    </div>
                    <BodyShort>
                        <AkselLink href="/slik-bruker-du-det-nye-soket">
                            <span className="link-icon">
                                <InformationSquareIcon aria-hidden="true" />
                            </span>
                            <span>Slik bruker du det nye søket for best resultat</span>
                        </AkselLink>
                    </BodyShort>
                </HStack>
            </Box>

            <Box paddingBlock={{ xs: "6", md: "6" }} className="text-center">
                <LoggedInButtons />
                <Show below="lg">
                    <Button
                        variant="tertiary"
                        onClick={() => {
                            setIsFiltersVisible(!isFiltersVisible);
                        }}
                        icon={<FilterIcon />}
                        aria-expanded={isFiltersVisible}
                    >
                        Velg sted, yrke og andre filtre
                    </Button>
                </Show>
            </Box>

            <SearchResultHeader
                isFiltersVisible={isFiltersVisible}
                searchResult={searchResult}
                query={updatedQuery}
                queryDispatch={queryDispatch}
            />

            <HGrid
                columns={{ xs: 1, lg: "220px auto", xl: "370px auto" }}
                gap={{ xs: "0", lg: "6", xl: "12" }}
                className="container-large mt-8"
            >
                <Hide below="lg">
                    <FiltersDesktop
                        query={updatedQuery}
                        dispatchQuery={queryDispatch}
                        aggregations={aggregations}
                        locations={locations}
                        postcodes={postcodes}
                        searchResult={searchResult}
                    />
                </Hide>

                <Show below="lg">
                    {isFiltersVisible && (
                        <FiltersMobile
                            query={updatedQuery}
                            dispatchQuery={queryDispatch}
                            aggregations={aggregations}
                            locations={locations}
                            postcodes={postcodes}
                            onCloseClick={() => setIsFiltersVisible(false)}
                            searchResult={searchResult}
                        />
                    )}
                </Show>

                <VStack gap="10">
                    <SearchResult searchResult={searchResult} query={updatedQuery} />

                    {/* Elastic search does not support pagination above 10 000 */}
                    {query.from + query.size === 10000 && <MaxResultsBox />}

                    <SearchPagination searchResult={searchResult} query={query} queryDispatch={queryDispatch} />

                    {query.from + SEARCH_CHUNK_SIZE >= searchResult.totalAds && <DoYouWantToSaveSearch query={query} />}
                    <Feedback query={query} />
                </VStack>
            </HGrid>
        </form>
    );
}

Search.propTypes = {
    aggregations: PropTypes.shape({}),
    locations: PropTypes.arrayOf(PropTypes.shape({})),
    searchResult: PropTypes.shape({
        ads: PropTypes.arrayOf(PropTypes.shape({})),
    }),
    query: PropTypes.shape({}),
};
