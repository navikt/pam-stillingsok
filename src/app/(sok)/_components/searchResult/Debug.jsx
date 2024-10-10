import React from "react";
import { BodyShort, Box, HStack, VStack } from "@navikt/ds-react";
import PropTypes from "prop-types";
import { useSearchParams } from "next/navigation";
import { QueryNames } from "@/app/(sok)/_utils/QueryNames";
import { mediumDisplayName } from "@/app/_common/utils/utils";

function GroupItem({ children, color = "surface-neutral-subtle", semibold }) {
    return (
        <Box background={color} padding="05 2" borderRadius="small">
            <BodyShort size="small" weight={semibold && "semibold"}>
                {children}
            </BodyShort>
        </Box>
    );
}

function Debug({ ad }) {
    const searchParams = useSearchParams();
    const janzzCategories = ad.categoryList?.filter((it) => it.categoryType === "JANZZ") || [];
    const otherCategories = ad.categoryList?.filter((it) => it.categoryType !== "JANZZ") || [];
    const synonyms =
        ad.properties?.searchtags
            ?.filter((synonym) => {
                const isDuplicate = janzzCategories.some((janzz) => synonym.label === janzz.name);
                return !isDuplicate;
            })
            .sort((a, b) => a.label.localeCompare(b.label, "no")) || [];

    return (
        <VStack gap="4">
            {searchParams.has(QueryNames.SEARCH_STRING) && (
                <HStack gap="2">
                    <BodyShort size="small">score {ad.score?.toFixed(2)}</BodyShort>
                </HStack>
            )}
            <HStack gap="2">
                {janzzCategories.map((category) => (
                    <GroupItem color="surface-success-subtle" semibold key={category.id}>
                        {category.name}
                    </GroupItem>
                ))}

                {synonyms.map((tag) => (
                    <GroupItem key={tag.label}>{tag.label}</GroupItem>
                ))}

                {otherCategories.map((category) => (
                    <GroupItem key={category.id}>
                        {category.name} ({category.categoryType?.toUpperCase()})
                    </GroupItem>
                ))}
            </HStack>

            {ad.properties?.keywords && (
                <HStack gap="2" align="center">
                    <BodyShort size="small">Keywords:</BodyShort>
                    {ad.properties.keywords.split(",").map((keywords) => (
                        <GroupItem key={keywords}>{keywords}</GroupItem>
                    ))}
                </HStack>
            )}

            {ad.medium && (
                <HStack gap="2" align="center">
                    <BodyShort size="small">Kilde:</BodyShort>
                    <GroupItem>{mediumDisplayName(ad.medium)}</GroupItem>
                </HStack>
            )}
        </VStack>
    );
}

Debug.propTypes = {
    ad: PropTypes.shape({
        medium: PropTypes.string,
        categoryList: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, categoryType: PropTypes.string })),
        occupationList: PropTypes.arrayOf(PropTypes.shape({ level1: PropTypes.string, level2: PropTypes.string })),
        properties: PropTypes.shape({
            keywords: PropTypes.string,
            searchtags: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, score: PropTypes.number })),
        }),
        score: PropTypes.number,
    }),
    score: PropTypes.string,
};

export default Debug;
