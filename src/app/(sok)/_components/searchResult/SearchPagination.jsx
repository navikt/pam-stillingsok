import React from "react";
import { Hide, Pagination, Select, Show, VStack } from "@navikt/ds-react";
import PropTypes from "prop-types";
import { useSearchParams } from "next/navigation";
import * as actions from "@/app/_common/actions";
import logAmplitudeEvent from "@/app/_common/monitoring/amplitude";
import useSearchQuery from "@/app/(sok)/_components/SearchQueryProvider";
import { FROM, SIZE } from "@/app/(sok)/_components/searchParamNames";
import { ALLOWED_NUMBER_OF_RESULTS_PER_PAGE, SEARCH_CHUNK_SIZE } from "../../_utils/query";

function SearchPagination({ searchResult }) {
    const searchQuery = useSearchQuery();
    const searchParams = useSearchParams();
    const resultsPerPage = searchParams.has(SIZE) ? parseInt(searchParams.get(SIZE), 10) : SEARCH_CHUNK_SIZE;

    // Elastic search does not allow pagination above 10 000 results.
    const totalPages = Math.ceil(
        searchResult.totalAds < 10000 ? searchResult.totalAds / resultsPerPage : 9999 / resultsPerPage,
    );
    const page = searchParams.has(FROM) ? Math.floor(parseInt(searchParams.get(FROM), 10) / resultsPerPage) + 1 : 1;

    const onPageChange = (x) => {
        const from = x * resultsPerPage - resultsPerPage;
        searchQuery.setPaginate(true);
        if (from > 0) {
            searchQuery.set(FROM, `${from}`);
        } else {
            searchQuery.remove(FROM);
        }

        if (resultsPerPage !== SEARCH_CHUNK_SIZE) {
            searchQuery.set(SIZE, `${resultsPerPage}`);
        }
    };

    if (totalPages === 0) {
        return null;
    }

    return (
        <VStack gap="10" align="center">
            <Show above="md">
                <Pagination
                    aria-label="Navigasjon mellom søketreff"
                    onPageChange={onPageChange}
                    page={page}
                    count={totalPages}
                    prevNextTexts
                    boundaryCount={1}
                    siblingCount={1}
                />
            </Show>
            <Hide above="md">
                <Pagination
                    aria-label="Navigasjon mellom søketreff"
                    onPageChange={onPageChange}
                    page={page}
                    count={totalPages}
                    boundaryCount={1}
                    siblingCount={0}
                    size="small"
                />
            </Hide>
            <Select
                label="Antall treff per side"
                onChange={(e) => {
                    const size = e.target.value;
                    searchQuery.remove(FROM);
                    searchQuery.set(SIZE, size);
                    logAmplitudeEvent("Page size Changed", { size });
                    actions.saveResultsPerPage(size);
                }}
                value={resultsPerPage}
                className="inline-select"
            >
                {ALLOWED_NUMBER_OF_RESULTS_PER_PAGE.map((item) => (
                    <option value={item} key={`page-${item}`}>
                        {item}
                    </option>
                ))}
            </Select>
        </VStack>
    );
}

SearchPagination.propTypes = {
    searchResult: PropTypes.shape({
        ads: PropTypes.arrayOf(PropTypes.shape({})),
    }),
};

export default SearchPagination;
