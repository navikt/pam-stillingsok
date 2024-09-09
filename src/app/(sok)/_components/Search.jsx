import React, { useEffect, useState } from "react";
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
import { InformationSquareIcon, TrashIcon } from "@navikt/aksel-icons";
import SaveSearchButton from "@/app/lagrede-sok/_components/SaveSearchButton";
import fixLocationName from "@/app/_common/utils/fixLocationName";
import useSearchQuery from "@/app/(sok)/_components/SearchQueryProvider";
import { DISTANCE, FROM, POSTCODE, SIZE } from "@/app/(sok)/_components/searchParamNames";
import { SEARCH_CHUNK_SIZE } from "../_utils/query";
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

export default function Search({ searchResult, aggregations, locations, postcodes }) {
    const searchQuery = useSearchQuery();
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

    useEffect(() => {
        logAmplitudeEvent("Stillinger - Utførte søk");
    }, []);

    function onFormSubmit(e) {
        e.preventDefault();
    }

    const drivingDistanceFilterActive =
        searchQuery.has(POSTCODE) && searchQuery.get(POSTCODE).length === 4 && searchQuery.get(DISTANCE) > 0;
    const onlyPostcodeOrDistanceFilterActive =
        searchQuery.size === 2 && (searchQuery.has(POSTCODE) || searchQuery.has(DISTANCE));
    const showSaveAndResetButton = searchQuery.size > 0 && !onlyPostcodeOrDistanceFilterActive;
    const chosenPostcodeCity =
        drivingDistanceFilterActive && postcodes.find((p) => p.postcode === searchQuery.get(POSTCODE)).city;
    const from = searchQuery.get(FROM) || 0;
    const size = searchQuery.get(SIZE) || SEARCH_CHUNK_SIZE;

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
                <SearchBox aggregations={aggregations} locations={locations} />

                {drivingDistanceFilterActive && (
                    <HStack align="center" wrap={false} gap="2">
                        <HStack gap="2">
                            <BodyShort weight="semibold">Reisevei:</BodyShort>
                            <BodyShort>
                                Innen {searchQuery.get(DISTANCE)} km fra {searchQuery.get(POSTCODE)}{" "}
                                {fixLocationName(chosenPostcodeCity)}
                            </BodyShort>
                        </HStack>
                        <Button
                            type="button"
                            variant="tertiary"
                            onClick={() => {
                                searchQuery.remove(POSTCODE);
                                searchQuery.remove(DISTANCE);
                            }}
                            icon={<TrashIcon aria-hidden="true" />}
                            size="small"
                        >
                            Fjern
                        </Button>
                    </HStack>
                )}
                <HStack minHeight="36px" className="mt-3" gap="2" columns="2" align="baseline">
                    <div>
                        {showSaveAndResetButton && (
                            <>
                                <SaveSearchButton size="small" />
                                <Button
                                    type="button"
                                    variant="tertiary"
                                    onClick={() => {
                                        searchQuery.reset();
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

            <SearchResultHeader isFiltersVisible={isFiltersVisible} searchResult={searchResult} />

            <HGrid
                columns={{ xs: 1, lg: "220px auto", xl: "370px auto" }}
                gap={{ xs: "0", lg: "6", xl: "12" }}
                className="container-large mt-8"
            >
                <Hide below="lg">
                    <FiltersDesktop
                        aggregations={aggregations}
                        locations={locations}
                        postcodes={postcodes}
                        searchResult={searchResult}
                    />
                </Hide>

                <Show below="lg">
                    {isFiltersVisible && (
                        <FiltersMobile
                            aggregations={aggregations}
                            locations={locations}
                            postcodes={postcodes}
                            onCloseClick={() => setIsFiltersVisible(false)}
                            searchResult={searchResult}
                        />
                    )}
                </Show>

                <VStack gap="10">
                    <SearchResult searchResult={searchResult} />

                    {/* Elastic search does not support pagination above 10 000 */}
                    {from + size === 10000 && <MaxResultsBox />}

                    <SearchPagination searchResult={searchResult} />

                    {from + SEARCH_CHUNK_SIZE >= searchResult.totalAds && <DoYouWantToSaveSearch />}
                    <Feedback />
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
};
