import React, { ReactElement } from "react";
import SearchCombobox from "@/app/stillinger/(sok)/_components/searchBox/SearchCombobox";
import { BodyShort, Box, Button, Heading, HStack, VStack, Stack, BodyLong } from "@navikt/ds-react";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import fixLocationName from "@/app/stillinger/_common/utils/fixLocationName";
import { CarIcon, TrashIcon, ArrowCirclepathIcon } from "@navikt/aksel-icons";
import SaveSearchButton, { toSavedSearch } from "@/app/stillinger/lagrede-sok/_components/SaveSearchButton";
import useQuery, { sizeWorkaround } from "@/app/stillinger/(sok)/_components/QueryProvider";
import LoggedInButtons from "@/app/stillinger/(sok)/_components/loggedInButtons/LoggedInButtons";
import type FilterAggregations from "@/app/stillinger/_common/types/FilterAggregations";
import { type Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import { type SearchLocation } from "@/app/stillinger/(sok)/page";
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";

interface SearchBoxProps {
    aggregations: FilterAggregations;
    locations: SearchLocation[];
    postcodes: Postcode[];
    removeStuffForTest: boolean;
}

export default function SearchBox({
    aggregations,
    locations,
    postcodes,
    removeStuffForTest = false,
}: SearchBoxProps): ReactElement {
    const query = useQuery();
    const searchParams = useSearchParams();
    const pathname = usePathname();

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
        <Box paddingBlock={{ xs: "space-0 space-24", lg: "space-40 space-48" }}>
            <Box
                paddingInline={{ xs: "space-16", md: "space-32" }}
                paddingBlock={{ xs: "space-16", md: "space-24" }}
                borderRadius={{ lg: "8" }}
                maxWidth={{ lg: "800px" }}
                className="search-container"
            >
                <HStack justify="space-between" align="center" className="mb-1">
                    <Heading level="1" size="large">
                        Søk etter jobber
                    </Heading>
                    {!removeStuffForTest && <LoggedInButtons />}
                </HStack>

                {!removeStuffForTest && (
                    <BodyShort className="mb-4">
                        <AkselNextLink href="/slik-bruker-du-det-nye-soket">
                            Slik bruker du søket for best resultat
                        </AkselNextLink>
                    </BodyShort>
                )}

                <VStack gap="space-12">
                    <SearchCombobox aggregations={aggregations} locations={locations} />

                    {drivingDistanceFilterActive && (
                        <HStack align="center" wrap={false} gap="space-4">
                            <HStack wrap={false} align="center" gap="space-8">
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

                    {showSaveAndResetButton && !removeStuffForTest && (
                        <HStack gap="space-8" align="center" justify="end">
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
                    {searchParams.get("locked") === "true" && (
                        <>
                            <div className="mb-2"></div>
                            <Stack justify="space-between" align="center" gap="space-8">
                                <BodyLong weight="semibold">
                                    Søkefeltet er låst slik at du kan sammenligne resultatene.
                                </BodyLong>
                                <Button as={Link} icon={<ArrowCirclepathIcon />} variant="tertiary" href={pathname}>
                                    Gjør et nytt søk
                                </Button>
                            </Stack>
                        </>
                    )}
                </VStack>
            </Box>
        </Box>
    );
}
