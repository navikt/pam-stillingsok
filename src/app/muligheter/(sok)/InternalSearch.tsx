import React, { useState } from "react";
import "./internalSearch.css";
import { Alert, Box, HGrid, Hide, LinkCard, Show, VStack } from "@navikt/ds-react";
import { FETCH_SEARCH_WITHIN_DISTANCE_ERROR, FetchError } from "@/app/stillinger/(sok)/_utils/fetchTypes";
import FiltersDesktop from "@/app/stillinger/(sok)/_components/filters/FiltersDesktop";
import SearchResultHeader from "@/app/stillinger/(sok)/_components/searchResultHeader/SearchResultHeader";
import FiltersMobile from "@/app/stillinger/(sok)/_components/filters/FiltersMobile";
import SearchPagination from "@/app/stillinger/(sok)/_components/searchResult/SearchPagination";
import MaxResultsBox from "@/app/stillinger/(sok)/_components/searchResult/MaxResultsBox";
import type FilterAggregations from "@/app/stillinger/_common/types/FilterAggregations";
import { type Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import { type SearchResult as SearchResultType } from "@/app/stillinger/_common/types/SearchResult";
import { type SearchLocation } from "@/app/stillinger/(sok)/page";
import { PageBlock } from "@navikt/ds-react/Page";
import InternalSearchResult from "@/app/muligheter/(sok)/_components/InternalSearchResult";
import SearchBoxInternal from "@/app/muligheter/(sok)/_components/SearchBoxInternal";
import { LinkCardDescription, LinkCardTitle } from "@navikt/ds-react/LinkCard";
import AkselNextLinkCardAnchor from "@/app/_common/components/AkselNextLinkCardAnchor/AkselNextLinkCardAnchor";

interface SearchProps {
    searchResult: SearchResultType;
    aggregations: FilterAggregations;
    locations: SearchLocation[];
    postcodes: Postcode[];
    resultsPerPage: number;
    errors: FetchError[];
    removeStuffForTest: boolean;
}
const InternalSearch = ({
    searchResult,
    aggregations,
    locations,
    postcodes,
    resultsPerPage,
    errors,
    removeStuffForTest = false,
}: SearchProps) => {
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    const failedToSearchForPostcodes =
        errors.length > 0 && errors.find((error) => error.type === FETCH_SEARCH_WITHIN_DISTANCE_ERROR);

    return (
        <div className="mb-24" id="search-wrapper">
            <SearchBoxInternal aggregations={aggregations} locations={locations} postcodes={postcodes} />
            <Box
                paddingInline={{ xs: "space-16", md: "space-32", lg: "space-0" }}
                borderRadius={{ lg: "8" }}
                maxWidth={{ lg: "800px" }}
                className="muligheter-link-panel-container mb-12"
            >
                <LinkCard className="muligheter-link-panel" arrowPosition="center">
                    <LinkCardTitle>
                        <AkselNextLinkCardAnchor href="/stillinger">
                            Nye muligheter for deg som er registrert jobbsøker hos Nav
                        </AkselNextLinkCardAnchor>
                    </LinkCardTitle>
                    <LinkCardDescription>
                        Når du er jobbsøker hos Nav, får du nå se egne stillinger som andre ikke ser. Vi kaller disse
                        stillingene muligheter. Les mer om muligheter ved å trykke her.
                    </LinkCardDescription>
                </LinkCard>
            </Box>

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
                            <Alert variant="warning">
                                Reisevei-filteret er midlertidig utilgjengelig og påvirker ikke søkeresultatene. For å
                                avgrense søket, bruk kommune- eller fylkesfilteret.
                            </Alert>
                        )}

                        <InternalSearchResult searchResult={searchResult} />
                        <MaxResultsBox resultsPerPage={resultsPerPage} />
                        {!removeStuffForTest && (
                            <>
                                <SearchPagination searchResult={searchResult} resultsPerPage={resultsPerPage} />
                            </>
                        )}
                    </VStack>
                </HGrid>
            </PageBlock>
        </div>
    );
};
export default InternalSearch;
