import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Alert, HGrid, Hide, Show, VStack } from "@navikt/ds-react";
import { FETCH_SEARCH_WITHIN_DISTANCE_ERROR } from "@/app/(sok)/_utils/fetchTypes";
import SearchResult from "./searchResult/SearchResult";
import DoYouWantToSaveSearch from "./howToPanels/DoYouWantToSaveSearch";
import Feedback from "./feedback/Feedback";
import FiltersDesktop from "./filters/FiltersDesktop";
import SearchResultHeader from "./searchResultHeader/SearchResultHeader";
import logAmplitudeEvent from "../../_common/monitoring/amplitude";
import FiltersMobile from "./filters/FiltersMobile";
import SearchBox from "./searchBox/SearchBox";
import SearchPagination from "./searchResult/SearchPagination";
import MaxResultsBox from "./searchResult/MaxResultsBox";

export default function Search({ searchResult, aggregations, locations, postcodes, resultsPerPage, errors }) {
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    const failedToSearchForPostcodes =
        errors.length > 0 && errors.find((error) => error.type === FETCH_SEARCH_WITHIN_DISTANCE_ERROR);

    useEffect(() => {
        logAmplitudeEvent("Stillinger - Utførte søk");
    }, []);

    return (
        <div className="mb-24">
            <SearchBox aggregations={aggregations} locations={locations} postcodes={postcodes} />
            <SearchResultHeader
                setIsFiltersVisible={setIsFiltersVisible}
                isFiltersVisible={isFiltersVisible}
                searchResult={searchResult}
            />

            <HGrid
                columns={{ xs: 1, lg: "220px auto", xl: "370px auto" }}
                gap={{ xs: "0", lg: "6", xl: "12" }}
                className="container-large mt-6"
            >
                <Hide below="lg">
                    <FiltersDesktop
                        aggregations={aggregations}
                        locations={locations}
                        postcodes={postcodes}
                        searchResult={searchResult}
                        errors={errors}
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
                            errors={errors}
                        />
                    )}
                </Show>

                <VStack gap="10">
                    {failedToSearchForPostcodes && (
                        <Alert variant="warning">
                            Reisevei-filteret er midlertidig utilgjengelig og påvirker ikke søkeresultatene. For å
                            avgrense søket, bruk kommune- eller fylkesfilteret.
                        </Alert>
                    )}

                    <SearchResult searchResult={searchResult} />
                    <MaxResultsBox resultsPerPage={resultsPerPage} />
                    <SearchPagination searchResult={searchResult} resultsPerPage={resultsPerPage} />
                    <DoYouWantToSaveSearch totalAds={searchResult.totalAds} />
                    {searchResult?.ads?.length > 0 && <Feedback searchResult={searchResult} />}
                </VStack>
            </HGrid>
        </div>
    );
}

Search.propTypes = {
    aggregations: PropTypes.shape({}),
    locations: PropTypes.arrayOf(PropTypes.shape({})),
    searchResult: PropTypes.shape({
        ads: PropTypes.arrayOf(PropTypes.shape({})),
    }),
};
