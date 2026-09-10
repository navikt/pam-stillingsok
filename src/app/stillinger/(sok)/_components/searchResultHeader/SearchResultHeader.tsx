import { BodyShort, Box, Heading, HGrid, HStack, Stack } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/Page";
import type { SearchResult } from "@/app/stillinger/_common/types/SearchResult";
import { formatNumber } from "@/app/stillinger/_common/utils/utils";
import Sorting from "@/app/stillinger/(sok)/_components/searchResult/Sorting";

interface SearchResultHeaderProps {
    searchResult: SearchResult;
}

export default function SearchResultHeader({ searchResult }: SearchResultHeaderProps) {
    const stillingerWord: string = searchResult.totalPositions === 1 ? "stilling" : "stillinger";

    return (
        <Box className="bg-alt-1-subtle-on-lg" paddingBlock={{ lg: "space-16" }}>
            <PageBlock as="section" width="xl" gutters>
                <HGrid
                    columns={{ xs: 1, lg: "220px auto", xl: "400px auto" }}
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
                            className="full-width"
                        >
                            <div>
                                <Heading level="2" size="small" className="white-space-nowrap" aria-live="polite">
                                    <span>
                                        {searchResult.totalAds > 0
                                            ? `${formatNumber(searchResult.totalAds)} treff`
                                            : "Ingen treff"}
                                    </span>
                                </Heading>
                                <BodyShort className="white-space-nowrap">
                                    {searchResult.totalPositions && searchResult.totalAds > 0
                                        ? `${formatNumber(searchResult.totalPositions)} ${stillingerWord}`
                                        : ""}
                                </BodyShort>
                            </div>

                            <HStack gap="space-8" align="center" wrap={false}>
                                <Sorting />
                            </HStack>
                        </HStack>
                    </Stack>
                </HGrid>
            </PageBlock>
        </Box>
    );
}
