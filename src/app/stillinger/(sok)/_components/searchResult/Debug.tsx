import React, { ReactElement } from "react";
import { BodyShort, Box, HStack, ReadMore, VStack } from "@navikt/ds-react";
import { useSearchParams } from "next/navigation";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import DebugExplain from "@/app/stillinger/(sok)/_components/searchResult/DebugExplain";
import { type StillingSoekElement } from "@/server/schemas/stillingSearchSchema";

interface GroupItemProps {
    children: ReactElement | string;
}

function GroupItem({ children }: GroupItemProps): ReactElement {
    return (
        <Box
            background="surface-subtle"
            paddingInline="2"
            paddingBlock="05"
            borderRadius="medium"
            borderColor="border-subtle"
            borderWidth="1"
        >
            <BodyShort size="small" weight="regular">
                {children}
            </BodyShort>
        </Box>
    );
}

interface DebugProps {
    ad: Partial<StillingSoekElement>;
}

function Debug({ ad }: DebugProps): ReactElement {
    const searchParams = useSearchParams();
    const keywords = ad.keywords?.split(/[,;]/).filter((keyword: string) => keyword !== "null") || [];

    return (
        <VStack gap="2">
            {ad.score && (
                <BodyShort size="small" weight="semibold">
                    Score: {ad.score.toFixed(2)}
                </BodyShort>
            )}

            {searchParams.has(QueryNames.SEARCH_STRING) && ad.explanation && (
                <ReadMore size="small" header="Score explanation" defaultOpen>
                    <DebugExplain explanation={ad.explanation} />
                </ReadMore>
            )}

            <ReadMore size="small" header="Search tags">
                <VStack gap="2">
                    <div>
                        <BodyShort size="small" spacing>
                            categoryList:
                        </BodyShort>
                        <HStack gap="2" align="center">
                            {ad.categoryList
                                ?.map((category) => `${category.name} (${category.categoryType.toLowerCase()})`)
                                .filter((value, index, array) => array.indexOf(value) === index) // remove duplicates
                                .map((item) => (
                                    <GroupItem key={item}>{item}</GroupItem>
                                ))}
                        </HStack>
                    </div>

                    {ad.searchtags && (
                        <div>
                            <BodyShort size="small" spacing>
                                searchtags:
                            </BodyShort>

                            <HStack gap="2" align="center">
                                {ad?.searchtags?.map((tag) => (
                                    <GroupItem key={tag.label}>{tag.label}</GroupItem>
                                ))}
                            </HStack>
                        </div>
                    )}

                    {ad.searchtagsai && Array.isArray(ad.searchtagsai) && (
                        <div>
                            <BodyShort size="small" spacing>
                                searchtagsai:
                            </BodyShort>
                            <HStack gap="2" align="center">
                                {ad.searchtagsai.map((searchTagAi: string) => (
                                    <GroupItem key={searchTagAi}>{searchTagAi}</GroupItem>
                                ))}
                            </HStack>
                        </div>
                    )}

                    {ad.isSummerJob && (
                        <BodyShort size="small" weight="semibold">
                            isSummerJob: {ad.isSummerJob}
                        </BodyShort>
                    )}
                    {ad.summerJobConfidence && (
                        <BodyShort size="small" weight="semibold">
                            summerJobConfidence: {ad.summerJobConfidence}
                        </BodyShort>
                    )}
                    {ad.summerJobReason && (
                        <BodyShort size="small" weight="semibold">
                            summerJobReason: {ad.summerJobReason}
                        </BodyShort>
                    )}

                    {keywords.length > 0 && (
                        <div>
                            <BodyShort size="small" spacing>
                                keywords:
                            </BodyShort>
                            <HStack gap="2" align="center">
                                {keywords.map((keyword: string) => (
                                    <GroupItem key={keyword}>{keyword}</GroupItem>
                                ))}
                            </HStack>
                        </div>
                    )}
                </VStack>
            </ReadMore>
        </VStack>
    );
}

export default Debug;
