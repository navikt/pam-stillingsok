import React from "react";
import { BodyShort, Box, HStack, VStack } from "@navikt/ds-react";
import PropTypes from "prop-types";

function GroupTitle({ children }) {
    return (
        <Box padding="05 0" borderRadius="small">
            <BodyShort weight="semibold" textColor="subtle" size="small">
                {children}:
            </BodyShort>
        </Box>
    );
}

function GroupItem({ children }) {
    return (
        <Box background="surface-neutral-subtle" padding="05 1" borderRadius="small">
            <BodyShort textColor="subtle" size="small">
                {children}
            </BodyShort>
        </Box>
    );
}

function Debug({ ad }) {
    return (
        <VStack gap="2" className="mt-2">
            {ad.categoryList?.length > 0 && (
                <HStack gap="2">
                    <GroupTitle>Yrke</GroupTitle>
                    {ad.categoryList &&
                        ad.categoryList.map((category) => (
                            <GroupItem key={category.id}>
                                {category.name}{" "}
                                {category.categoryType !== "JANZZ" ? `(${category.categoryType.toUpperCase()})` : ""}
                            </GroupItem>
                        ))}
                </HStack>
            )}
            {ad.properties?.searchtags?.length > 0 && (
                <HStack gap="2">
                    <GroupTitle>Synonymer</GroupTitle>
                    {ad.properties.searchtags &&
                        ad.properties.searchtags.map((tag) => <GroupItem key={tag.label}>{tag.label}</GroupItem>)}
                </HStack>
            )}

            <HStack gap="2">
                <GroupTitle>Score</GroupTitle>
                <GroupItem>{ad.score?.toFixed(2)}</GroupItem>
            </HStack>
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
