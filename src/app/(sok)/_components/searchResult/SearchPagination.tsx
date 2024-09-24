import React, { ReactElement } from "react";
import { Hide, Pagination, Select, Show, VStack } from "@navikt/ds-react";
import { useSearchParams } from "next/navigation";
import * as actions from "@/app/_common/actions";
import logAmplitudeEvent from "@/app/_common/monitoring/amplitude";
import useSearchQuery from "@/app/(sok)/_components/SearchQueryProvider";
import { FROM } from "@/app/(sok)/_components/searchParamNames";
import { ALLOWED_NUMBER_OF_RESULTS_PER_PAGE } from "../../_utils/query";

interface SearchPaginationProps {
    totalAds: number;
    resultsPerPage: number;
}

export default function SearchPagination({ totalAds, resultsPerPage }: SearchPaginationProps): ReactElement {
    const searchQuery = useSearchQuery();
    const searchParams = useSearchParams();

    // Elastic search does not allow pagination above 10 000 results.
    const totalPages = Math.ceil(totalAds < 10000 ? totalAds / resultsPerPage : 9999 / resultsPerPage);
    const page = searchParams.has(FROM) ? Math.floor(parseInt(searchParams.get(FROM)!, 10) / resultsPerPage) + 1 : 1;

    const onPageChange = (x: number): void => {
        const from = x * resultsPerPage - resultsPerPage;
        searchQuery.setPaginate(true);
        if (from > 0) {
            searchQuery.set(FROM, `${from}`);
        } else {
            searchQuery.remove(FROM);
        }
    };

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
