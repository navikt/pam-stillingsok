import React, { ReactElement } from "react";
import { BodyShort, Box, HStack, Tag, VStack } from "@navikt/ds-react";
import { SommerjobbAd } from "@/app/sommerjobb/_utils/types/SommerjobbAd";
import { SOMMERJOBB_CATEGORIES } from "@/app/sommerjobb/_utils/searchKeywords";

interface SommerjobbItemProps {
    sommerjobbAd: SommerjobbAd;
}

function DebugItem({ sommerjobbAd }: SommerjobbItemProps): ReactElement {
    const allCategories = SOMMERJOBB_CATEGORIES.map((cat) => cat.values).flat();

    function findCategory(aiTags: string[]) {
        const cats: string[] = [];
        SOMMERJOBB_CATEGORIES.forEach((cat) => {
            aiTags.forEach((tag) => {
                if (cat.values.includes(tag)) {
                    cats.push(cat.label);
                }
            });
        });
        return [...new Set(cats)];
    }

    const categories = findCategory(sommerjobbAd.searchtagsai || []);

    return (
        <Box paddingBlock="4">
            <VStack gap="4">
                <HStack gap="2">
                    {categories.map((t) => (
                        <Tag size="small" variant="neutral-moderate" key={t}>
                            {t}
                        </Tag>
                    ))}
                    {categories.length === 0 && (
                        <Tag size="small" variant="neutral-moderate">
                            Andre
                        </Tag>
                    )}
                </HStack>

                {sommerjobbAd.searchtagsai && Array.isArray(sommerjobbAd.searchtagsai) && (
                    <HStack gap="1" align="center">
                        {sommerjobbAd.searchtagsai.map((it: string, index) => (
                            <HStack align="baseline" key={it}>
                                <Box
                                    background={
                                        allCategories.includes(it) ? "surface-warning-subtle" : "surface-default"
                                    }
                                >
                                    <BodyShort size="small">{it}</BodyShort>
                                </Box>
                                {index + 1 < sommerjobbAd.searchtagsai!.length ? ", " : "."}
                            </HStack>
                        ))}
                    </HStack>
                )}
                {(!sommerjobbAd.searchtagsai || sommerjobbAd.searchtagsai.length === 0) && (
                    <BodyShort size="small">(Mangler AI-tags)</BodyShort>
                )}

                <HStack gap="2">
                    {sommerjobbAd.generatedSearchMetadata?.summerJobMetadata?.isSummerJob === true && (
                        <Tag size="small" variant="alt1-moderate">
                            KI: Er sommerjobb
                        </Tag>
                    )}
                    {sommerjobbAd.generatedSearchMetadata?.summerJobMetadata?.isSummerJob === false && (
                        <Tag size="small" variant="alt3-moderate">
                            KI: Er ikke sommerjobb
                        </Tag>
                    )}
                </HStack>
                <BodyShort size="small">
                    Forklaring: {sommerjobbAd.generatedSearchMetadata?.summerJobMetadata?.summerJobReason}
                </BodyShort>
            </VStack>
        </Box>
    );
}

export default DebugItem;
