import React, { ReactElement } from "react";
import { BodyShort, Box, HStack, VStack } from "@navikt/ds-react";
import { useSearchParams } from "next/navigation";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import DebugExplain from "@/app/stillinger/(sok)/_components/searchResult/DebugExplain";
import { StillingSoekElement } from "@/server/schemas/stillingSearchSchema";

interface GroupItemProps {
    children: ReactElement | string;
}

function GroupItem({ children }: GroupItemProps): ReactElement {
    return (
        <Box
            background="surface-neutral-subtle"
            paddingInline="2"
            paddingBlock="05"
            borderRadius="small"
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
                <BodyShort size="medium" weight="semibold">
                    Score: {ad.score.toFixed(2)}
                </BodyShort>
            )}

            {searchParams.has(QueryNames.SEARCH_STRING) && ad.explanation && (
                <div>
                    <BodyShort size="small" spacing>
                        Explanation:
                    </BodyShort>
                    {<DebugExplain explanation={ad.explanation} />}
                </div>
            )}
            <div>
                <BodyShort size="small" spacing>
                    categoryList:
                </BodyShort>
                <HStack gap="1" align="center">
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

                    <HStack gap="1" align="center">
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
                    <HStack gap="1" align="center">
                        {ad.searchtagsai.map((searchTagAi: string) => (
                            <GroupItem key={searchTagAi}>{searchTagAi}</GroupItem>
                        ))}
                    </HStack>
                </div>
            )}

            {keywords.length > 0 && (
                <div>
                    <BodyShort size="small" spacing>
                        keywords:
                    </BodyShort>
                    <HStack gap="1" align="center">
                        {keywords.map((keyword: string) => (
                            <GroupItem key={keyword}>{keyword}</GroupItem>
                        ))}
                    </HStack>
                </div>
            )}
        </VStack>
    );
}

export default Debug;
