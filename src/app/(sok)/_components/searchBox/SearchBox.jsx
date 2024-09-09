import React from "react";
import PropTypes from "prop-types";
import SearchCombobox from "@/app/(sok)/_components/searchBox/SearchCombobox";
import { BodyShort, Box, Button, HStack, Link as AkselLink } from "@navikt/ds-react";
import { DISTANCE, POSTCODE, URL_VERSION } from "@/app/(sok)/_components/searchParamNames";
import fixLocationName from "@/app/_common/utils/fixLocationName";
import { InformationSquareIcon, TrashIcon } from "@navikt/aksel-icons";
import SaveSearchButton, { toSavedSearch } from "@/app/lagrede-sok/_components/SaveSearchButton";
import useSearchQuery from "@/app/(sok)/_components/SearchQueryProvider";

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
        <Box
            padding={{ xs: "6 4", md: "6 12" }}
            background="surface-alt-1-subtle"
            borderRadius={{ md: "large" }}
            className="SearchContainer"
        >
            <section aria-label="Søk etter stilling" className="mb-4">
                <SearchCombobox aggregations={aggregations} locations={locations} />
            </section>
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
    );
}

SearchBox.propTypes = {
    locations: PropTypes.arrayOf(PropTypes.shape({})),
};

export default SearchBox;
