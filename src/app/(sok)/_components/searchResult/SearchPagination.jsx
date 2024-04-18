import React from "react";
import { Hide, Pagination, Select, Show, VStack } from "@navikt/ds-react";
import PropTypes from "prop-types";
import * as actions from "@/app/_common/actions";
import { SET_FROM_AND_SIZE } from "../../_utils/queryReducer";
import { ALLOWED_NUMBER_OF_RESULTS_PER_PAGE, SEARCH_CHUNK_SIZE } from "../../_utils/query";

function SearchPagination({ searchResult, query, queryDispatch }) {
    const resultsPerPage = query.size || SEARCH_CHUNK_SIZE;

    // Elastic search does not allow pagination above 10 000 results.
    const totalPages = Math.ceil(
        searchResult.totalAds < 10000 ? searchResult.totalAds / resultsPerPage : 9999 / resultsPerPage,
    );
    const page = query.from ? Math.floor(query.from / resultsPerPage) + 1 : 1;

    const onPageChange = (x) => {
        queryDispatch({
            type: SET_FROM_AND_SIZE,
            from: x * resultsPerPage - resultsPerPage,
            size: resultsPerPage,
        });
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
                    const size = parseInt(e.target.value, 10);
                    queryDispatch({
                        type: SET_FROM_AND_SIZE,
                        from: 0,
                        size,
                    });
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
    query: PropTypes.shape({
        from: PropTypes.number,
    }),
    queryDispatch: PropTypes.func.isRequired,
};

export default SearchPagination;
