import React, { ReactElement } from "react";
import { Hide, Pagination, Select, Show, VStack } from "@navikt/ds-react";
import { useSearchParams } from "next/navigation";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import { ALLOWED_NUMBER_OF_RESULTS_PER_PAGE, MAX_RESULT_WINDOW } from "@/app/stillinger/(sok)/_utils/query";
import { track } from "@/app/_common/umami";

interface SearchPaginationProps {
    searchResult: { totalAds: number };
    resultsPerPage: number;
}

export default function SearchPagination({ searchResult, resultsPerPage }: SearchPaginationProps): ReactElement | null {
    const query = useQuery();
    const searchParams = useSearchParams();

    // Elastic search does not allow pagination above 10 000 results.
    const cappedTotalAds = Math.min(searchResult.totalAds, MAX_RESULT_WINDOW);
    const totalPages = Math.ceil(cappedTotalAds / resultsPerPage);

    const page = searchParams.has(QueryNames.FROM)
        ? Math.floor(parseInt(searchParams.get(QueryNames.FROM)!, 10) / resultsPerPage) + 1
        : 1;

    const onPageChange = (x: number): void => {
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
        <VStack gap="space-40" align="center">
            <Show above="md">
                <Pagination
                    aria-label="Navigasjon mellom søketreff"
                    onPageChange={onPageChange}
                    page={page}
                    count={totalPages}
                    prevNextTexts
                    boundaryCount={1}
                    siblingCount={1}
                    renderItem={(item) => <Pagination.Item {...item} page={undefined} />}
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
                    renderItem={(item) => <Pagination.Item {...item} page={undefined} />}
                />
            </Hide>
            <Select
                label="Antall treff per side"
                onChange={async (e) => {
                    const newSize = parseInt(e.target.value, 10);
                    query.set(QueryNames.PAGE_COUNT, `${newSize}`);
                    query.remove(QueryNames.FROM);
                    query.setPaginate(true);

                    track("Søk – antall treff per side endret", {
                        from: resultsPerPage,
                        to: newSize,
                        pageBefore: page,
                        pageAfter: 1,
                    });
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
