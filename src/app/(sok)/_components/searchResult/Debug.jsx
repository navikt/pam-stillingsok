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
                    <Box paddingBlock="05" paddingInline="1" background="surface-neutral-subtle">
                        <BodyShort size="small" textColor="subtle" className="monospace">
                            {tag}
                        </BodyShort>
                    </Box>
                )}
            </HStack>
        </Box>
    );
}

function Debug({ ad }) {
    const searchParams = useSearchParams();
    const janzzOccupations = ad.categoryList?.filter((it) => it.categoryType === "JANZZ") || [];
    const otherOccupationCategories = ad.categoryList?.filter((it) => it.categoryType !== "JANZZ") || [];
    const janzzSynonyms =
        ad.properties?.searchtags
            ?.filter((synonym) => {
                const isDuplicate = janzzOccupations.some((janzz) => synonym.label === janzz.name);
                return !isDuplicate;
            })
            .sort((a, b) => a.label.localeCompare(b.label, "no")) || [];

    return (
        <VStack gap="4">
            <HStack gap="2">
                {searchParams.has(QueryNames.SEARCH_STRING) && (
                    <GroupItem color={ad.score >= 2 ? "surface-warning-subtle" : "surface-danger-subtle"}>
                        {ad.score?.toFixed(1)}
                    </GroupItem>
                )}

                {ad.medium && <GroupItem color="surface-info-subtle">{mediumDisplayName(ad.medium)}</GroupItem>}

                {janzzOccupations.map((category) => (
                    <GroupItem color="surface-success-subtle" key={category.id}>
                        {category.name}
                    </GroupItem>
                ))}
            </HStack>
            <HStack gap="2" align="center">
                {janzzSynonyms.map((tag) => (
                    <GroupItem key={tag.label} tag="janzz">
                        {tag.label}
                    </GroupItem>
                ))}

                {otherOccupationCategories.map((category) => (
                    <GroupItem key={category.id} tag={category.categoryType?.toLowerCase()}>
                        {category.name}
                    </GroupItem>
                ))}
            </HStack>

            {ad.properties?.searchtagsai && Array.isArray(ad.properties.searchtagsai) && (
                <HStack gap="2" align="center">
                    {ad.properties.searchtagsai.map((searchTagAi) => (
                        <GroupItem key={searchTagAi} tag="ai">
                            {searchTagAi}
                        </GroupItem>
                    ))}
                </HStack>
            )}

            {ad.properties?.keywords && (
                <HStack gap="2" align="center">
                    {ad.properties.keywords.split(/[,;]/).map((keyword) => {
                        if (keyword === "null") return null;
                        return (
                            <GroupItem key={keyword} tag="kwrd">
                                {keyword}
                            </GroupItem>
                        );
                    })}
                </HStack>
            )}
        </VStack>
    );
}

export default Debug;
