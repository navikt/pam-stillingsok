import React, { useContext } from "react";
import { Hide, Pagination, Select, Show, VStack } from "@navikt/ds-react";
import PropTypes from "prop-types";
import * as actions from "@/app/_common/actions";
import {
    ALLOWED_NUMBER_OF_RESULTS_PER_PAGE,
    SearchQueryParams,
    SEARCH_RESULTS_PER_PAGE,
} from "@/app/(sok)/_utils/constants";
import { useSearchParams } from "next/navigation";
import logAmplitudeEvent from "@/app/_common/monitoring/amplitude";
import { UserPreferencesContext } from "@/app/_common/user/UserPreferenceProvider";
import MaxResultsBox from "@/app/(sok)/_components/searchResult/MaxResultsBox";
import DoYouWantToSaveSearch from "@/app/(sok)/_components/howToPanels/DoYouWantToSaveSearch";
import useSearchRouter from "@/app/(sok)/_utils/useSearchRouter";

function getSizeFromUrlOrCookie(searchParams, cookieValue) {
    if (searchParams.has(SearchQueryParams.SIZE)) {
        return parseInt(searchParams.get(SearchQueryParams.SIZE), 10);
    }
    if (cookieValue) {
        return parseInt(cookieValue, 10);
    }
    return SEARCH_RESULTS_PER_PAGE;
}

function SearchPagination({ searchResult, setFocusTopOfSearchResult }) {
    const searchParams = useSearchParams();
    const router = useSearchRouter();
    const { resultsPerPage } = useContext(UserPreferencesContext);
    const size = getSizeFromUrlOrCookie(searchParams, resultsPerPage);
    const from = searchParams.has(SearchQueryParams.FROM) ? parseInt(searchParams.get(SearchQueryParams.FROM), 10) : 0;

    // Elastic search does not allow pagination above 10 000 results.
    const totalPages = Math.ceil(searchResult.totalAds < 10000 ? searchResult.totalAds / size : 9999 / size);
    const page = searchParams.has(SearchQueryParams.FROM)
        ? Math.floor(parseInt(searchParams.get(SearchQueryParams.FROM), 10) / size) + 1
        : 1;

    const onPageChange = (x) => {
        const newFrom = x * size - size;
        const newSearchParams = new URLSearchParams(searchParams);

        if (newFrom === 0) {
            newSearchParams.delete(SearchQueryParams.FROM);
        } else {
            newSearchParams.set(SearchQueryParams.FROM, newFrom);
        }
        router.push(newSearchParams, { resetFrom: false });
        setFocusTopOfSearchResult();
    };

    const onSizePerPageChange = (e) => {
        const newSize = parseInt(e.target.value, 10);

        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete(SearchQueryParams.FROM);

        if (newSize === SEARCH_RESULTS_PER_PAGE) {
            newSearchParams.delete(SearchQueryParams.SIZE);
        } else {
            newSearchParams.set(SearchQueryParams.SIZE, newSize);
        }
        actions.saveResultsPerPage(newSize);
        setFocusTopOfSearchResult();
        router.push(newSearchParams);
        logAmplitudeEvent("Page size Changed", { size: newSize });
    };

    return (
        <>
            {from + size >= 10000 && <MaxResultsBox />}

            {totalPages > 0 && (
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
                        onChange={onSizePerPageChange}
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
            )}

            {from + size >= searchResult.totalAds && <DoYouWantToSaveSearch />}
        </>
    );
}

SearchPagination.propTypes = {
    searchResult: PropTypes.shape({
        ads: PropTypes.arrayOf(PropTypes.shape({})),
    }),
    setFocusTopOfSearchResult: PropTypes.func.isRequired,
};

export default SearchPagination;
