import React from "react";
import { BodyShort, Box, HStack, VStack } from "@navikt/ds-react";
import { useSearchParams } from "next/navigation";
import { QueryNames } from "@/app/(sok)/_utils/QueryNames";
import { mediumDisplayName } from "@/app/_common/utils/utils";

function GroupItem({ children, color = "surface-neutral-subtle", tag }) {
    return (
        <Box
            background={color}
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

function Debug({ ad }) {
    const searchParams = useSearchParams();
    const keywords = ad.properties.keywords?.split(/[,;]/).filter((keyword) => keyword !== "null") || [];

    return (
        <VStack gap="4">
            <HStack gap="2">
                {searchParams.has(QueryNames.SEARCH_STRING) && (
                    <GroupItem color={ad.score >= 1 ? "surface-success-subtle" : "surface-danger-subtle"}>
                        {ad.score?.toFixed(3)}
                    </GroupItem>
                )}

                {ad.medium && <GroupItem>{mediumDisplayName(ad.medium)}</GroupItem>}
            </HStack>

            <div>
                <BodyShort size="small" spacing>
                    Category (janzz + styrk/esco):
                </BodyShort>
                <HStack gap="2" align="center">
                    {ad.categoryList
                        ?.sort((a) => (a.categoryType === "JANZZ" ? -1 : 1))
                        .map((category) => (
                            <GroupItem
                                key={category.id}
                                tag={category.categoryType !== "JANZZ" && category.categoryType}
                            >
                                {category.name}
                            </GroupItem>
                        ))}
                </HStack>
            </div>

            {ad.properties?.searchtags && (
                <div>
                    <BodyShort size="small" spacing>
                        Search tags (janzz):
                    </BodyShort>

                    <HStack gap="2" align="center">
                        {ad.properties?.searchtags?.map((tag) => (
                            <GroupItem key={tag.label}>{tag.label}</GroupItem>
                        ))}
                    </HStack>
                </div>
            )}

            {ad.properties?.searchtagsai && Array.isArray(ad.properties.searchtagsai) && (
                <div>
                    <BodyShort size="small" spacing>
                        AI tags:
                    </BodyShort>
                    <HStack gap="2" align="center">
                        {ad.properties.searchtagsai.map((searchTagAi) => (
                            <GroupItem key={searchTagAi}>{searchTagAi} </GroupItem>
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
                        {keywords.map((keyword) => (
                            <GroupItem key={keyword}>{keyword}</GroupItem>
                        ))}
                    </HStack>
                </div>
            )}
        </VStack>
    );
}

export default Debug;
