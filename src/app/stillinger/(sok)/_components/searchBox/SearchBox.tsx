import React, { ReactElement } from "react";
import SearchCombobox from "@/app/stillinger/(sok)/_components/searchBox/SearchCombobox";
import { BodyShort, Box, Button, Heading, HStack, Link as AkselLink, VStack } from "@navikt/ds-react";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import fixLocationName from "@/app/stillinger/_common/utils/fixLocationName";
import { CarIcon, TrashIcon } from "@navikt/aksel-icons";
import SaveSearchButton, { toSavedSearch } from "@/app/stillinger/lagrede-sok/_components/SaveSearchButton";
import useQuery, { sizeWorkaround } from "@/app/stillinger/(sok)/_components/QueryProvider";
import LoggedInButtons from "@/app/stillinger/(sok)/_components/loggedInButtons/LoggedInButtons";
import FilterAggregations from "@/app/stillinger/_common/types/FilterAggregations";
import { Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import { SearchLocation } from "@/app/stillinger/(sok)/page";

interface SearchBoxProps {
    aggregations: FilterAggregations;
    locations: SearchLocation[];
    postcodes: Postcode[];
}

export default function SearchBox({ aggregations, locations, postcodes }: SearchBoxProps): ReactElement {
    const query = useQuery();

    const drivingDistanceFilterActive =
        query.has(QueryNames.POSTCODE) &&
        query.get(QueryNames.POSTCODE)!.length === 4 &&
        query.has(QueryNames.DISTANCE) &&
        parseInt(query.get(QueryNames.DISTANCE)!, 10) > 0;

    const onlyPostcodeOrDistanceFilterActive =
        sizeWorkaround(query.urlSearchParams) === 2 &&
        (query.has(QueryNames.POSTCODE) || query.has(QueryNames.DISTANCE));

    const savedSearchUrlWithoutVersion = toSavedSearch(query.urlSearchParams);
    savedSearchUrlWithoutVersion.delete(QueryNames.URL_VERSION);

    const showSaveAndResetButton =
        sizeWorkaround(savedSearchUrlWithoutVersion) > 0 && !onlyPostcodeOrDistanceFilterActive;

    /* const chosenPostcodeCity =
            drivingDistanceFilterActive &&
            postcodes.length > 0 &&
            postcodes.find((p) => p.postcode === query.get(QueryNames.POSTCODE)!)?.city;*/

    const chosenPostcodeCity =
        drivingDistanceFilterActive && postcodes.length > 0
            ? (postcodes.find((p) => p.postcode === query.get(QueryNames.POSTCODE)!)?.city ?? undefined)
            : undefined;

    return (
        <Box paddingBlock={{ xs: "0 6", lg: "10 12" }}>
            <Box
                paddingInline={{ xs: "4", md: "8" }}
                paddingBlock={{ xs: "4", md: "6" }}
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
                        <HStack gap="2" align="center" justify="end">
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
