import React from "react";
import { Box, HGrid, Hide, HStack, Show, Skeleton, Stack, VStack } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/Page";
import styles from "./SearchContentSkeleton.module.css";

type SearchContentSkeletonProps = Readonly<{
    readonly resultCardCount?: number;
}>;

const DEFAULT_RESULT_CARD_COUNT = 3;
const FILTER_OPTION_COUNT = 4;
const COLLAPSED_FILTER_COUNT = 4;

function FilterOptionSkeleton(): React.JSX.Element {
    return (
        <HStack gap="space-12" wrap={false} align="center">
            <Skeleton variant="circle" width={28} height={28} />
            <Skeleton variant="text" width="12rem" />
        </HStack>
    );
}

function ExpandedFilterSectionSkeleton(): React.JSX.Element {
    return (
        <section aria-label="Laster publisert-filter" className={styles["filter-section"]}>
            <HStack justify="space-between" align="center" wrap={false}>
                <HStack gap="space-8" align="center" wrap={false}>
                    <Skeleton variant="circle" width={24} height={24} />
                    <Skeleton variant="text" width="6rem" />
                </HStack>
            </HStack>

            <div className={styles["filter-options"]}>
                {Array.from({ length: FILTER_OPTION_COUNT }).map((_, index) => {
                    return <FilterOptionSkeleton key={`filter-option-${index}`} />;
                })}
            </div>
        </section>
    );
}

function CollapsedFilterSectionSkeleton(): React.JSX.Element {
    return (
        <div className={styles["collapsed-filter-section"]}>
            <HStack justify="space-between" align="center" wrap={false}>
                <HStack gap="space-8" align="center" wrap={false}>
                    <Skeleton variant="circle" width={24} height={24} />
                    <Skeleton variant="text" width="9rem" />
                </HStack>
            </HStack>
        </div>
    );
}

function FiltersSkeleton(): React.JSX.Element {
    return (
        <section aria-label="Laster filtre" className={styles["filter-column"]}>
            <ExpandedFilterSectionSkeleton />

            {Array.from({ length: COLLAPSED_FILTER_COUNT }).map((_, index) => {
                return <CollapsedFilterSectionSkeleton key={`collapsed-filter-${index}`} />;
            })}
        </section>
    );
}

function ResultCardSkeleton(): React.JSX.Element {
    return (
        <article className={styles["result-card"]}>
            <div className={styles["result-bookmark"]}>
                <Skeleton variant="circle" width={28} height={28} />
            </div>

            <VStack gap="space-8">
                <Skeleton variant="text" width="4.5rem" />
                <Skeleton variant="text" width="72%" />
                <Skeleton variant="text" width="48%" />
                <Skeleton variant="text" width="14rem" />
                <Skeleton variant="text" width="10rem" />
                <Skeleton variant="text" width="11rem" />
            </VStack>
        </article>
    );
}

function SearchResultsSkeleton({ resultCardCount }: Readonly<{ readonly resultCardCount: number }>): React.JSX.Element {
    return (
        <section aria-label="Laster treffliste" className={styles["result-column"]}>
            {Array.from({ length: resultCardCount }).map((_, index) => {
                return <ResultCardSkeleton key={`result-card-${index}`} />;
            })}
        </section>
    );
}

function SearchToolbarSkeleton(): React.JSX.Element {
    return (
        <Box className="bg-alt-1-subtle-on-lg" paddingBlock={{ lg: "space-16" }}>
            <PageBlock as="section" width="xl" gutters>
                <HGrid
                    columns={{ xs: 1, lg: "220px auto", xl: "370px auto" }}
                    gap={{ xs: "space-0", lg: "space-24", xl: "space-48" }}
                >
                    <div />

                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        justify={{ md: "space-between" }}
                        align={{ sm: "start", md: "center" }}
                        gap="space-16 space-32"
                        wrap={false}
                    >
                        <HStack
                            gap="space-8"
                            wrap={false}
                            justify="space-between"
                            align="center"
                            className={styles["full-width"]}
                        >
                            <VStack gap="space-8">
                                <Skeleton variant="rounded" width={140} height={24} />
                                <Skeleton variant="rounded" width={160} height={24} />
                            </VStack>

                            <Hide below="lg">
                                <HStack gap="space-8" align="center" wrap={false}>
                                    <Skeleton variant="text" width={96} height={24} />
                                    <Skeleton variant="rounded" width={160} height={48} />
                                </HStack>
                            </Hide>

                            <Show below="lg">
                                <HStack gap="space-8" align="center" wrap={false}>
                                    <Skeleton variant="rounded" width={160} height={48} />
                                    <Skeleton variant="rounded" width={48} height={48} />
                                </HStack>
                            </Show>
                        </HStack>
                    </Stack>
                </HGrid>
            </PageBlock>
        </Box>
    );
}

export default function SearchContentSkeleton({
    resultCardCount = DEFAULT_RESULT_CARD_COUNT,
}: SearchContentSkeletonProps): React.JSX.Element {
    return (
        <section aria-label="Laster søkeresultater" aria-busy="true">
            <SearchToolbarSkeleton />

            <PageBlock as="section" width="xl" gutters className={styles["content-wrapper"]}>
                <HGrid
                    columns={{ xs: 1, lg: "220px auto", xl: "370px auto" }}
                    gap={{ xs: "space-24", lg: "space-24", xl: "space-48" }}
                >
                    <Hide below="lg">
                        <FiltersSkeleton />
                    </Hide>

                    <SearchResultsSkeleton resultCardCount={resultCardCount} />
                </HGrid>
            </PageBlock>
        </section>
    );
}
