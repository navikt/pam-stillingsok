import React from "react";
import PropTypes from "prop-types";
import { useSearchParams } from "next/navigation";
import SearchCombobox from "@/app/(sok)/_components/searchBox/SearchCombobox";
import { BodyShort, Box, Button, Heading, HStack, Link as AkselLink, VStack } from "@navikt/ds-react";
import fixLocationName from "@/app/_common/utils/fixLocationName";
import { CarIcon, TrashIcon } from "@navikt/aksel-icons";
import { REMOVE_DISTANCE, REMOVE_POSTCODE } from "@/app/(sok)/_utils/queryReducer";
import SaveSearchButton from "@/app/lagrede-sok/_components/SaveSearchButton";
import LoggedInButtons from "@/app/(sok)/_components/loggedInButtons/LoggedInButtons";
import { FetchAction, useFetchReducer } from "@/app/_common/hooks/useFetchReducer";
import * as actions from "@/app/_common/actions";
import { getSearchBoxOptions } from "@/app/(sok)/_components/searchBox/buildSearchBoxOptions";

let suggestionsCache = [];
const CACHE_MAX_SIZE = 50;
const MINIMUM_LENGTH = 1;

function SearchBox({ dispatch, query, aggregations, locations, postcodes }) {
    const [suggestionsResponse, suggestionsDispatch] = useFetchReducer([]);
    const searchParams = useSearchParams();

    const drivingDistanceFilterActive = query.postcode && query.postcode.length === 4 && query.distance > 0;
    const onlyPostcodeOrDistanceFilterActive =
        searchParams.size === 2 && (searchParams.has("postcode") || searchParams.has("distance"));
    const showSaveAndResetButton = searchParams.size > 0 && !onlyPostcodeOrDistanceFilterActive;
    const chosenPostcodeCity = drivingDistanceFilterActive && postcodes.find((p) => p.postcode === query.postcode).city;

    async function fetchSuggestions(value) {
        const cached = suggestionsCache.find((c) => c.value === value);
        if (cached) {
            suggestionsDispatch({ type: FetchAction.RESOLVE, data: cached.data });
            return;
        }
        let data;
        try {
            data = await actions.getSuggestions(value, MINIMUM_LENGTH);
        } catch (err) {
            // ignore fetch failed errors
        }
        if (data) {
            suggestionsCache = [{ value, data }, ...suggestionsCache].slice(0, CACHE_MAX_SIZE);
            suggestionsDispatch({ type: FetchAction.RESOLVE, data });
        }
    }

    function handleValueChange(value) {
        if (value && value.length >= MINIMUM_LENGTH) {
            fetchSuggestions(value);
        }
    }

    const allSuggestions = [...suggestionsResponse.data];

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
                    <SearchCombobox
                        queryDispatch={dispatch}
                        query={query}
                        onChange={handleValueChange}
                        options={getSearchBoxOptions(aggregations, locations, allSuggestions)}
                    />

                    {drivingDistanceFilterActive && (
                        <HStack align="center" wrap={false} gap="1">
                            <HStack wrap={false} align="center" gap="2">
                                <CarIcon aria-label="Reisevei" fontSize="1.5rem" />
                                <BodyShort>
                                    Innen {query.distance} km fra {query.postcode} {fixLocationName(chosenPostcodeCity)}
                                </BodyShort>
                            </HStack>

                            <Button
                                type="button"
                                variant="tertiary"
                                onClick={() => {
                                    dispatch({ type: REMOVE_POSTCODE });
                                    dispatch({ type: REMOVE_DISTANCE });
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
                                <SaveSearchButton size="small" query={query} />
                                <Button
                                    type="button"
                                    variant="tertiary"
                                    onClick={() => {
                                        dispatch({ type: "RESET" });
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
    query: PropTypes.shape({
        q: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
    locations: PropTypes.arrayOf(PropTypes.shape({})),
};

export default SearchBox;
