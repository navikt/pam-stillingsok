import React, { ReactElement, useEffect, useState } from "react";
import { HGrid, Hide, Show, VStack } from "@navikt/ds-react";
import { FROM } from "@/app/(sok)/_components/searchParamNames";
import { useSearchParams } from "next/navigation";
import { SEARCH_CHUNK_SIZE } from "@/app/(sok)/_utils/query";
import SearchResultInterface from "@/app/(sok)/_types/SearchResult";
import FilterAggregations, { LocationFilterAggregation } from "@/app/(sok)/_types/FilterAggregations";
import { Postcode } from "@/app/(sok)/_utils/fetchPostcodes";
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

const ELASTIC_SEARCH_PAGINATION_LIMIT = 10000;

interface SearchProps {
    searchResult: SearchResultInterface;
    aggregations: FilterAggregations;
    locations: LocationFilterAggregation[];
    postcodes: Postcode[];
    resultsPerPage: number;
}

export default function Search({
    searchResult,
    aggregations,
    locations,
    postcodes,
    resultsPerPage,
}: SearchProps): ReactElement {
    const searchParams = useSearchParams();
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

    useEffect(() => {
        logAmplitudeEvent("Stillinger - Utførte søk");
    }, []);

    const from = searchParams.has(FROM) ? parseInt(searchParams.get(FROM)!, 10) : 0;

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
                    {searchResult.ads?.length > 0 && <SearchResult searchResult={searchResult} />}
                    {from + resultsPerPage === ELASTIC_SEARCH_PAGINATION_LIMIT && <MaxResultsBox />}
                    {searchResult.totalAds > 0 && (
                        <SearchPagination totalAds={searchResult.totalAds} resultsPerPage={resultsPerPage} />
                    )}
                    {from + SEARCH_CHUNK_SIZE >= searchResult.totalAds && <DoYouWantToSaveSearch />}
                    {searchResult.totalAds > 0 && <Feedback />}
                </VStack>
            </HGrid>
        </div>
    );
}
