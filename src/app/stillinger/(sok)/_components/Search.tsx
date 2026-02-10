import React, { useState } from "react";
import { BodyLong, HGrid, Hide, LocalAlert, Show, VStack } from "@navikt/ds-react";
import { FETCH_SEARCH_WITHIN_DISTANCE_ERROR, FetchError } from "@/app/stillinger/(sok)/_utils/fetchTypes";
import SearchResult from "./searchResult/SearchResult";
import DoYouWantToSaveSearch from "./howToPanels/DoYouWantToSaveSearch";
import Feedback from "./feedback/Feedback";
import FiltersDesktop from "./filters/FiltersDesktop";
import SearchResultHeader from "./searchResultHeader/SearchResultHeader";
import FiltersMobile from "./filters/FiltersMobile";
import SearchBox from "./searchBox/SearchBox";
import SearchPagination from "./searchResult/SearchPagination";
import MaxResultsBox from "./searchResult/MaxResultsBox";
import type FilterAggregations from "@/app/stillinger/_common/types/FilterAggregations";
import { type Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import { type SearchResult as SearchResultType } from "@/app/stillinger/_common/types/SearchResult";
import { type SearchLocation } from "@/app/stillinger/(sok)/page";
import UtdanningNoPanel from "./utdanningno/UtdanningNoPanel";
import { PageBlock } from "@navikt/ds-react/Page";

interface SearchProps {
    searchResult: SearchResultType;
    aggregations: FilterAggregations;
    locations: SearchLocation[];
    postcodes: Postcode[];
    resultsPerPage: number;
    errors: FetchError[];
}
const Search = ({ searchResult, aggregations, locations, postcodes, resultsPerPage, errors }: SearchProps) => {
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    const failedToSearchForPostcodes =
        errors.length > 0 && errors.find((error) => error.type === FETCH_SEARCH_WITHIN_DISTANCE_ERROR);

    return (
        <div className="mb-24" id="search-wrapper">
            <SearchBox aggregations={aggregations} locations={locations} postcodes={postcodes} />
            <SearchResultHeader
                setIsFiltersVisible={setIsFiltersVisible}
                isFiltersVisible={isFiltersVisible}
                searchResult={searchResult}
            />

            <PageBlock as="div" width="xl" gutters>
                <HGrid
                    columns={{ xs: "space-4", lg: "220px auto", xl: "370px auto" }}
                    gap={{ xs: "space-0", lg: "space-24", xl: "space-48" }}
                    className="mt-6"
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

                    <VStack gap="space-40">
                        {failedToSearchForPostcodes && (
                            <LocalAlert status="warning">
                                <LocalAlert.Header>
                                    <LocalAlert.Title>Reisevei utilgjengelig</LocalAlert.Title>
                                </LocalAlert.Header>
                                <LocalAlert.Content>
                                    <BodyLong>
                                        Reisevei-filteret er midlertidig utilgjengelig og påvirker ikke søkeresultatene.
                                        For å avgrense søket, bruk kommune- eller fylkesfilteret.
                                    </BodyLong>
                                </LocalAlert.Content>
                            </LocalAlert>
                        )}

                        <SearchResult searchResult={searchResult} />
                        <MaxResultsBox resultsPerPage={resultsPerPage} />

                        <SearchPagination searchResult={searchResult} resultsPerPage={resultsPerPage} />
                        <DoYouWantToSaveSearch totalAds={searchResult.totalAds} resultsPerPage={resultsPerPage} />

                        <UtdanningNoPanel />
                        {searchResult.ads?.length > 0 && <Feedback />}
                    </VStack>
                </HGrid>
            </PageBlock>
        </div>
    );
};
export default Search;
