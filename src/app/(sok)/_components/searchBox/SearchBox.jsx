import React from "react";
import PropTypes from "prop-types";
import SearchCombobox from "@/app/(sok)/_components/searchBox/SearchCombobox";
import { BodyShort, Box, Button, Heading, HStack, Link as AkselLink, VStack } from "@navikt/ds-react";
import { DISTANCE, POSTCODE, URL_VERSION } from "@/app/(sok)/_components/searchParamNames";
import fixLocationName from "@/app/_common/utils/fixLocationName";
import { CarIcon, TrashIcon } from "@navikt/aksel-icons";
import SaveSearchButton, { toSavedSearch } from "@/app/lagrede-sok/_components/SaveSearchButton";
import useSearchQuery from "@/app/(sok)/_components/SearchQueryProvider";
import LoggedInButtons from "@/app/(sok)/_components/loggedInButtons/LoggedInButtons";

function SearchBox({ aggregations, locations, postcodes }) {
    const searchQuery = useSearchQuery();

    const drivingDistanceFilterActive =
        searchQuery.has(POSTCODE) && searchQuery.get(POSTCODE).length === 4 && searchQuery.get(DISTANCE) > 0;
    const onlyPostcodeOrDistanceFilterActive =
        searchQuery.size === 2 && (searchQuery.has(POSTCODE) || searchQuery.has(DISTANCE));
    const savedSearchUrlWithoutVersion = toSavedSearch(searchQuery.urlSearchParams);
    savedSearchUrlWithoutVersion.delete(URL_VERSION);
    const showSaveAndResetButton = savedSearchUrlWithoutVersion.size > 0 && !onlyPostcodeOrDistanceFilterActive;
    const chosenPostcodeCity =
        drivingDistanceFilterActive && postcodes.find((p) => p.postcode === searchQuery.get(POSTCODE)).city;

    return (
        <Box paddingBlock={{ xs: "0 6", lg: "10 12" }}>
            <Box
                padding={{ xs: "4", md: "6 8" }}
                background="surface-alt-1-subtle"
                borderRadius={{ lg: "large" }}
                maxWidth={{ lg: "800px" }}
                className="SearchContainer"
            >
                <HStack justify="space-between" align="center" className="mb-1">
                    <Heading level="1" size="large">
                        Søk etter jobber
                    </Heading>
                    <LoggedInButtons />
                </HStack>

                <BodyShort className="mb-4">
                    <AkselLink href="/slik-bruker-du-det-nye-soket">Slik bruker du søket for best resultat</AkselLink>
                </BodyShort>

                <VStack gap="3">
                    <SearchCombobox aggregations={aggregations} locations={locations} />

                    {drivingDistanceFilterActive && (
                        <HStack align="center" wrap={false} gap="1">
                            <HStack wrap={false} align="center" gap="2">
                                <CarIcon aria-label="Reisevei" fontSize="1.5rem" />
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

                    {showSaveAndResetButton && (
                        <HStack gap="2" columns="2" align="center" justify="end">
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
                        </HStack>
                    )}
                </VStack>
            </Box>
        </Box>
    );
}

SearchBox.propTypes = {
    locations: PropTypes.arrayOf(PropTypes.shape({})),
};

export default SearchBox;
