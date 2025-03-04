import React, { ReactElement, useCallback } from "react";
import { HStack, Pagination } from "@navikt/ds-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PAGE_PARAM_NAME, SEARCH_RESULT_SIZE } from "@/app/sommerjobb/_components/constants";

interface SommerjobbPagineringProps {
    totalAds: number;
}

function SommerjobbPaginering({ totalAds }: SommerjobbPagineringProps): ReactElement {
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
            router.push(pathname + "?" + params.toString(), { scroll: false });
        },
        [searchParams, pathname, router],
    );

    // Todo test 10 000 limit
    // Elastic search does not allow pagination above 10 000 results.
    const count = Math.ceil(totalAds < 10000 ? totalAds / SEARCH_RESULT_SIZE : 9999 / SEARCH_RESULT_SIZE);

    // Todo test hva som skjer om url inneholder page større en det som er tilgjengelig
    return (
        <HStack justify="center">
            <Pagination
                page={searchParams.has(PAGE_PARAM_NAME) ? parseInt(searchParams.get(PAGE_PARAM_NAME)!) : 1}
                onPageChange={(value) => setPageParam(value)}
                count={count}
                boundaryCount={1}
                siblingCount={1}
            />
        </HStack>
    );
}

export default SommerjobbPaginering;
