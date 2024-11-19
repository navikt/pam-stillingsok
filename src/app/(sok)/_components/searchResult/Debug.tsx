import React, { ReactElement } from "react";
import { BodyShort, Box, HStack, VStack } from "@navikt/ds-react";
import { useSearchParams } from "next/navigation";
import { QueryNames } from "@/app/(sok)/_utils/QueryNames";
import DebugExplain from "@/app/(sok)/_components/searchResult/DebugExplain";
import { StillingSoekElement } from "@/server/schemas/stillingSearchSchema";

interface GroupItemProps {
    children: ReactElement | string;
    tag?: string;
}

function GroupItem({ children, tag }: GroupItemProps): ReactElement {
    return (
        <Box
            background="surface-neutral-subtle"
            paddingInline={tag ? "2 0" : "2"}
            paddingBlock={tag ? "0" : "05"}
            borderRadius="small"
            borderColor="border-subtle"
            borderWidth="1"
        >
            <HStack align="center" gap="2">
                <BodyShort size="small" weight="regular">
                    {children}
                </BodyShort>
                {tag && (
                    <Box
                        borderColor="border-subtle"
                        borderWidth="0 0 0 1"
                        paddingBlock="05"
                        paddingInline="1"
                        background="surface-subtle"
                    >
                        <BodyShort size="small" textColor="subtle" className="monospace">
                            {tag.toLowerCase()}
                        </BodyShort>
                    </Box>
                )}
            </HStack>
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
        <VStack gap="4">
            <div>
                <BodyShort size="small" spacing>
                    Category (janzz + styrk/esco):
                </BodyShort>
                <HStack gap="2" align="center">
                    {ad.categoryList
                        ?.sort((category) => (category.categoryType === "JANZZ" ? -1 : 1))
                        .map((category) => (
                            <GroupItem
                                key={category.id}
                                tag={(category.categoryType !== "JANZZ" && category.categoryType) || ""}
                            >
                                {category.name}
                            </GroupItem>
                        ))}
                </HStack>
            </div>

            {ad.searchtags && (
                <div>
                    <BodyShort size="small" spacing>
                        Search tags (janzz):
                    </BodyShort>

                    <HStack gap="2" align="center">
                        {ad?.searchtags?.map((tag) => <GroupItem key={tag.label}>{tag.label}</GroupItem>)}
                    </HStack>
                </div>
            )}

            {ad.searchtagsai && Array.isArray(ad.searchtagsai) && (
                <div>
                    <BodyShort size="small" spacing>
                        AI tags:
                    </BodyShort>
                    <HStack gap="2" align="center">
                        {ad.searchtagsai.map((searchTagAi: string) => (
                            <GroupItem key={searchTagAi}>{searchTagAi}</GroupItem>
                        ))}
                    </HStack>
                </div>
            )}

            {keywords.length > 0 && (
                <div>
                    <BodyShort size="small" spacing>
                        Keywords:
                    </BodyShort>
                    <HStack gap="2" align="center">
                        {keywords.map((keyword: string) => (
                            <GroupItem key={keyword}>{keyword}</GroupItem>
                        ))}
                    </HStack>
                </div>
            )}

            {searchParams.has(QueryNames.SEARCH_STRING) && (
                <div>
                    <BodyShort size="small" spacing>
                        Explanation:
                    </BodyShort>
                    {ad.explanation && <DebugExplain explanation={ad.explanation} />}
                </div>
            )}
        </VStack>
    );
}

export default Debug;
