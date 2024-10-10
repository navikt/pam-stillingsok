import React from "react";
import PropTypes from "prop-types";
import SearchCombobox from "@/app/(sok)/_components/searchBox/SearchCombobox";
import { BodyShort, Box, Button, Heading, HStack, Link as AkselLink, VStack } from "@navikt/ds-react";
import { QueryNames } from "@/app/(sok)/_utils/QueryNames";
import fixLocationName from "@/app/_common/utils/fixLocationName";
import { CarIcon, TrashIcon } from "@navikt/aksel-icons";
import SaveSearchButton, { toSavedSearch } from "@/app/lagrede-sok/_components/SaveSearchButton";
import useQuery, { sizeWorkaround } from "@/app/(sok)/_components/QueryProvider";
import LoggedInButtons from "@/app/(sok)/_components/loggedInButtons/LoggedInButtons";

function SearchBox({ aggregations, locations, postcodes }) {
    const query = useQuery();

    const drivingDistanceFilterActive =
        query.has(QueryNames.POSTCODE) &&
        query.get(QueryNames.POSTCODE).length === 4 &&
        query.get(QueryNames.DISTANCE) > 0;
    const onlyPostcodeOrDistanceFilterActive =
        sizeWorkaround(query.urlSearchParams) === 2 &&
        (query.has(QueryNames.POSTCODE) || query.has(QueryNames.DISTANCE));
    const savedSearchUrlWithoutVersion = toSavedSearch(query.urlSearchParams);
    savedSearchUrlWithoutVersion.delete(QueryNames.URL_VERSION);
    const showSaveAndResetButton =
        sizeWorkaround(savedSearchUrlWithoutVersion) > 0 && !onlyPostcodeOrDistanceFilterActive;
    const chosenPostcodeCity =
        drivingDistanceFilterActive &&
        postcodes.size > 0 &&
        postcodes.find((p) => p.postcode === query.get(QueryNames.POSTCODE)).city;

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
                                    Innen {query.get(QueryNames.DISTANCE)} km fra {query.get(QueryNames.POSTCODE)}{" "}
                                    {fixLocationName(chosenPostcodeCity)}
                                </BodyShort>
                            </HStack>

                            <Button
                                type="button"
                                variant="tertiary"
                                onClick={() => {
                                    query.remove(QueryNames.POSTCODE);
                                    query.remove(QueryNames.DISTANCE);
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
                                        query.reset();
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
