"use client";
import { BodyLong, HGrid, Hide, LocalAlert, Show, VStack } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/Page";
import { useState } from "react";
import type { SearchLocation } from "@/app/_common/geografi/locationsMapping";
import type FilterAggregations from "@/app/stillinger/_common/types/FilterAggregations";
import type { SearchResult as SearchResultType } from "@/app/stillinger/_common/types/SearchResult";
import SummerJobPanel from "@/app/stillinger/(sok)/_components/howToPanels/SummerJobPanel";
import UngJobPanel from "@/app/stillinger/(sok)/_components/howToPanels/UngJobPanel";
import useQuery, { type QueryActions } from "@/app/stillinger/(sok)/_components/QueryProvider";
import type { Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import { FETCH_SEARCH_WITHIN_DISTANCE_ERROR, type FetchError } from "@/app/stillinger/(sok)/_utils/fetchTypes";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import Feedback from "./feedback/Feedback";
import FiltersDesktop from "./filters/FiltersDesktop";
import FiltersMobile from "./filters/FiltersMobile";
import DoYouWantToSaveSearch from "./howToPanels/DoYouWantToSaveSearch";
import MaxResultsBox from "./searchResult/MaxResultsBox";
import SearchPagination from "./searchResult/SearchPagination";
import SearchResult from "./searchResult/SearchResult";
import SearchResultHeader from "./searchResultHeader/SearchResultHeader";
import UtdanningNoPanel from "./utdanningno/UtdanningNoPanel";

type SearchProps = {
    readonly searchResult: SearchResultType;
    readonly aggregations: FilterAggregations;
    readonly locations: readonly SearchLocation[];
    readonly postcodes: readonly Postcode[];
    readonly resultsPerPage: number;
    readonly errors: readonly FetchError[];
};

function getTipsPanel(query: QueryActions) {
    if (query.getAll(QueryNames.SEARCH_STRING).some((q) => q.toLowerCase() === "sommerjobb")) {
        return <SummerJobPanel />;
    } else if (
        query.getAll(QueryNames.EXPERIENCE).includes("Ingen") ||
        query.getAll(QueryNames.EDUCATION).includes("Ingen krav") ||
        query.getAll(QueryNames.UNDER18).includes("true")
    ) {
        return <UngJobPanel />;
    }
    return <UtdanningNoPanel />;
}

const Search = ({ searchResult, aggregations, locations, postcodes, resultsPerPage, errors }: SearchProps) => {
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    const query = useQuery();
    const tipsPanel = getTipsPanel(query);

    const failedToSearchForPostcodes =
        errors.length > 0 && errors.some((error) => error.type === FETCH_SEARCH_WITHIN_DISTANCE_ERROR);

    return (
        <div className="mb-24" id="search-wrapper">
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
                        {tipsPanel}
                        {searchResult.ads?.length > 0 && <Feedback />}
                    </VStack>
                </HGrid>
            </PageBlock>
        </div>
    );
};

export default Search;
