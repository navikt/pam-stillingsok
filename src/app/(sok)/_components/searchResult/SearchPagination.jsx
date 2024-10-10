import React from "react";
import { Hide, Pagination, Select, Show, VStack } from "@navikt/ds-react";
import PropTypes from "prop-types";
import { useSearchParams } from "next/navigation";
import * as actions from "@/app/_common/actions";
import logAmplitudeEvent from "@/app/_common/monitoring/amplitude";
import useQuery from "@/app/(sok)/_components/QueryProvider";
import { QueryNames } from "@/app/(sok)/_components/QueryNames";
import { ALLOWED_NUMBER_OF_RESULTS_PER_PAGE } from "../../_utils/query";

function SearchPagination({ searchResult, resultsPerPage }) {
    const query = useQuery();
    const searchParams = useSearchParams();

    // Elastic search does not allow pagination above 10 000 results.
    const totalPages = Math.ceil(
        searchResult.totalAds < 10000 ? searchResult.totalAds / resultsPerPage : 9999 / resultsPerPage,
    );
    const page = searchParams.has(QueryNames.FROM)
        ? Math.floor(parseInt(searchParams.get(QueryNames.FROM), 10) / resultsPerPage) + 1
        : 1;

    const onPageChange = (x) => {
        const from = x * resultsPerPage - resultsPerPage;
        query.setPaginate(true);
        if (from > 0) {
            query.set(QueryNames.FROM, `${from}`);
        } else {
            query.remove(QueryNames.FROM);
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
                    query.remove(QueryNames.FROM);
                    query.setPaginate(true);
                    logAmplitudeEvent("Page size Changed", { size: newSize });
                    actions.saveResultsPerPage(newSize);
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
