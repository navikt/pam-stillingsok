import React, { ReactElement, useCallback } from "react";
import { Button, Hide, HStack, Pagination, Show } from "@navikt/ds-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PAGE_PARAM_NAME, SEARCH_RESULT_SIZE } from "@/app/sommerjobb/_components/constants";
import { ChevronLeftIcon, ChevronRightIcon } from "@navikt/aksel-icons";

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
            <Hide below="md">
                <Pagination
                    page={currentPage > numberOfPages ? numberOfPages : currentPage}
                    onPageChange={setPageParam}
                    count={numberOfPages}
                    boundaryCount={1}
                    siblingCount={1}
                    renderItem={(item) => <Pagination.Item {...item} page={undefined} />}
                />
            </Hide>
            <Show below="md">
                <HStack gap="2" justify="space-between">
                    {currentPage > 1 && (
                        <Button
                            variant="secondary"
                            icon={<ChevronLeftIcon />}
                            onClick={() => {
                                setPageParam(currentPage - 1);
                            }}
                        >
                            Forrige
                        </Button>
                    )}
                    {currentPage < numberOfPages && (
                        <Button
                            variant="primary"
                            iconPosition="right"
                            icon={<ChevronRightIcon />}
                            onClick={() => {
                                setPageParam(currentPage + 1);
                            }}
                        >
                            Neste
                        </Button>
                    )}
                </HStack>
            </Show>
        </HStack>
    );
}

export default SommerjobbPagination;
