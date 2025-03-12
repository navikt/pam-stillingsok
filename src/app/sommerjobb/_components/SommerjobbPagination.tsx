import React, { ReactElement, useCallback } from "react";
import { Button, Hide, HStack, Pagination, Show } from "@navikt/ds-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PAGE_PARAM_NAME, SOMMERJOBB_SEARCH_RESULT_SIZE } from "@/app/sommerjobb/_components/constants";
import { ChevronLeftIcon, ChevronRightIcon } from "@navikt/aksel-icons";

interface SommerjobbPaginationProps {
    totalAds: number;
    scrollToTopOfSearchResults: () => void;
}

function SommerjobbPagination({ totalAds, scrollToTopOfSearchResults }: SommerjobbPaginationProps): ReactElement {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Elastic search does not allow pagination above 10 000 results.
    const numberOfPages = Math.ceil(
        totalAds < 10000 ? totalAds / SOMMERJOBB_SEARCH_RESULT_SIZE : 9999 / SOMMERJOBB_SEARCH_RESULT_SIZE,
    );
    const currentPage = searchParams.has(PAGE_PARAM_NAME) ? parseInt(searchParams.get(PAGE_PARAM_NAME)!) : 1;

    const setPageParam = useCallback(
        (value: number) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(PAGE_PARAM_NAME, `${value}`);
            router.push(pathname + "?" + params.toString(), { scroll: false });
            scrollToTopOfSearchResults();
        },
        [searchParams, pathname, router, scrollToTopOfSearchResults],
    );

    return (
        <HStack justify="center">
            <Hide below="md">
                <Pagination
                    aria-label="Sidevelger"
                    page={currentPage > numberOfPages ? numberOfPages : currentPage}
                    onPageChange={setPageParam}
                    count={numberOfPages}
                    boundaryCount={1}
                    siblingCount={1}
                    renderItem={(item) => <Pagination.Item {...item} page={undefined} />}
                />
            </Hide>
            <Show below="md">
                <HStack as="nav" gap="2" justify="space-between" aria-label="Sidevelger">
                    {currentPage > 1 && (
                        <Button
                            variant="secondary-neutral"
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
                            variant="secondary-neutral"
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
