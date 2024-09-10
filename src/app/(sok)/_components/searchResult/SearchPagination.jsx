import React from "react";
import { Hide, Pagination, Select, Show, VStack } from "@navikt/ds-react";
import PropTypes from "prop-types";
import { useSearchParams } from "next/navigation";
import * as actions from "@/app/_common/actions";
import logAmplitudeEvent from "@/app/_common/monitoring/amplitude";
import useSearchQuery from "@/app/(sok)/_components/SearchQueryProvider";
import { FROM } from "@/app/(sok)/_components/searchParamNames";
import { ALLOWED_NUMBER_OF_RESULTS_PER_PAGE } from "../../_utils/query";

function SearchPagination({ searchResult, size }) {
    const searchQuery = useSearchQuery();
    const searchParams = useSearchParams();

    // Elastic search does not allow pagination above 10 000 results.
    const totalPages = Math.ceil(searchResult.totalAds < 10000 ? searchResult.totalAds / size : 9999 / size);
    const page = searchParams.has(FROM) ? Math.floor(parseInt(searchParams.get(FROM), 10) / size) + 1 : 1;

    const onPageChange = (x) => {
        const from = x * size - size;
        searchQuery.setPaginate(true);
        if (from > 0) {
            searchQuery.set(FROM, `${from}`);
        } else {
            searchQuery.remove(FROM);
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
                    const newSize = parseInt(e.target.value, 10);
                    searchQuery.remove(FROM);
                    searchQuery.setPaginate(true);
                    logAmplitudeEvent("Page size Changed", { size: newSize });
                    actions.saveResultsPerPage(newSize);
                }}
                value={size}
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
