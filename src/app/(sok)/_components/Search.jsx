import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { HGrid, Hide, Show, VStack } from "@navikt/ds-react";
import useSearchQuery from "@/app/(sok)/_components/SearchQueryProvider";
import { FROM } from "@/app/(sok)/_components/searchParamNames";
import { SEARCH_CHUNK_SIZE } from "../_utils/query";
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

export default function Search({ searchResult, aggregations, locations, postcodes, size }) {
    const searchQuery = useSearchQuery();
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

    useEffect(() => {
        logAmplitudeEvent("Stillinger - Utførte søk");
    }, []);

    function onFormSubmit(e) {
        e.preventDefault();
    }

    const from = searchQuery.has(FROM) ? parseInt(searchQuery.get(FROM), 10) : 0;

    return (
        <form onSubmit={onFormSubmit} className="mb-24">
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

                    <SearchPagination searchResult={searchResult} size={size} />

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
