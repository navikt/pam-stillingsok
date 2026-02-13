import React, { useCallback } from "react";
import { BodyLong, Button, Hide, HStack, Pagination, Show, VStack } from "@navikt/ds-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PAGE_PARAM_NAME, SOMMERJOBB_SEARCH_RESULT_SIZE } from "@/app/sommerjobb/_utils/constants";
import { ChevronLeftIcon, ChevronRightIcon } from "@navikt/aksel-icons";

interface SommerjobbPaginationProps {
    totalAds: number;
    scrollToTopOfSearchResults: () => void;
}

function SommerjobbPagination({ totalAds, scrollToTopOfSearchResults }: SommerjobbPaginationProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Elastic search does not allow pagination above 10 000 results.
    const numberOfPages = Math.ceil(
        totalAds < 10000 ? totalAds / SOMMERJOBB_SEARCH_RESULT_SIZE : 9999 / SOMMERJOBB_SEARCH_RESULT_SIZE,
    );

    const currentPage = searchParams.has(PAGE_PARAM_NAME) ? Number.parseInt(searchParams.get(PAGE_PARAM_NAME)!) : 1;

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
        <VStack gap="space-16">
            {currentPage === 10000 / SOMMERJOBB_SEARCH_RESULT_SIZE && (
                <BodyLong className="text-center">
                    Du har nådd maks antall annonser for ditt søk. Utvid søket ditt med andre filtre for å oppdage flere
                    annonser.
                </BodyLong>
            )}

            {numberOfPages > 1 && (
                <HStack justify="center">
                    <Hide below="md">
                        <Pagination
                            aria-label="Sidevelger"
                            page={currentPage > numberOfPages ? numberOfPages : currentPage}
                            onPageChange={setPageParam}
                            count={numberOfPages}
                            boundaryCount={1}
                            siblingCount={1}
                            renderItem={(item) => <Pagination.Item {...item} />}
                        />
                    </Hide>
                    <Show below="md">
                        <HStack as="nav" gap="space-8" justify="space-between" aria-label="Sidevelger">
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
            )}
        </VStack>
    );
}

export default SommerjobbPagination;
