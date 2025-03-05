import React, { ReactElement, useCallback } from "react";
import { HStack, Pagination } from "@navikt/ds-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PAGE_PARAM_NAME, SEARCH_RESULT_SIZE } from "@/app/sommerjobb/_components/constants";

interface SommerjobbPaginationProps {
    totalAds: number;
}

function SommerjobbPagination({ totalAds }: SommerjobbPaginationProps): ReactElement {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const setPageParam = useCallback(
        (value: number) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value === 1) {
                params.delete(PAGE_PARAM_NAME);
            } else {
                params.set(PAGE_PARAM_NAME, `${value}`);
            }
            router.push(pathname + "?" + params.toString());
        },
        [searchParams, pathname, router],
    );

    // Todo test 10 000 limit
    // Elastic search does not allow pagination above 10 000 results.
    const numberOfPages = Math.ceil(totalAds < 10000 ? totalAds / SEARCH_RESULT_SIZE : 9999 / SEARCH_RESULT_SIZE);
    const currentPage = searchParams.has(PAGE_PARAM_NAME) ? parseInt(searchParams.get(PAGE_PARAM_NAME)!) : 1;

    return (
        <HStack justify="center">
            <Pagination
                page={currentPage > numberOfPages ? numberOfPages : currentPage}
                onPageChange={setPageParam}
                count={numberOfPages}
                boundaryCount={1}
                siblingCount={1}
            />
        </HStack>
    );
}

export default SommerjobbPagination;
