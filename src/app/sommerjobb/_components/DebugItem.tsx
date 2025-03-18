import React, { ReactElement } from "react";
import { BodyShort, Box, HStack, Tag, VStack } from "@navikt/ds-react";
import { SommerjobbAd } from "@/app/sommerjobb/_utils/types/SommerjobbAd";
import { StillingSoekResponseExplanation } from "@/server/schemas/stillingSearchSchema";
import { SOMMERJOBB_CATEGORIES } from "@/app/sommerjobb/_utils/searchKeywords";

interface DebugExplainProps {
    explanation: StillingSoekResponseExplanation;
    defaultOpen?: boolean;
}

interface SommerjobbItemProps {
    sommerjobbAd: SommerjobbAd;
}

function DebugExplain({ explanation }: DebugExplainProps): ReactElement {
    return (
        <>
            {explanation.details.length > 0 && (
                <>
                    {explanation.description.startsWith("weight(") && (
                        <Box background="surface-subtle" padding="1">
                            <BodyShort size="small">
                                {explanation.description.split("weight(")[1].split(" ")[0].split(":").join("=")}
                            </BodyShort>
                        </Box>
                    )}
                    {explanation.details.length > 0 &&
                        explanation.details.map((it) => <DebugExplain explanation={it} key={it.description} />)}
                </>
            )}
        </>
    );
}

function DebugItem({ sommerjobbAd }: SommerjobbItemProps): ReactElement {
    const allCategories = SOMMERJOBB_CATEGORIES.map((cat) => cat.values).flat();

    function findCategory(aiTags: string[]) {
        const cats: string[] = [];
        SOMMERJOBB_CATEGORIES.forEach((cat) => {
            aiTags.forEach((tag) => {
                if (cat.values.includes(tag.toLowerCase())) {
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
                        <Tag size="small" variant="error-filled">
                            Mangler søkeord?
                        </Tag>
                    )}
                </HStack>

                {sommerjobbAd.searchtagsai && Array.isArray(sommerjobbAd.searchtagsai) && (
                    <HStack gap="1" align="center">
                        <Box background="surface-subtle" padding="1">
                            <BodyShort size="small" weight="semibold">
                                ai-tags
                            </BodyShort>
                        </Box>
                        {sommerjobbAd.searchtagsai.map((it: string) => (
                            <Box
                                key={it}
                                background={
                                    allCategories.includes(it.toLowerCase())
                                        ? "surface-neutral-moderate"
                                        : "surface-subtle"
                                }
                                padding="1"
                            >
                                <BodyShort size="small">{it}</BodyShort>
                            </Box>
                        ))}
                    </HStack>
                )}

                {sommerjobbAd.explanation && sommerjobbAd.explanation.details.length > 0 && (
                    <HStack gap="2">
                        <Box background="surface-subtle" padding="1">
                            <BodyShort size="small" weight="semibold">
                                score{" "}
                                {Math.abs(sommerjobbAd.explanation.value) % 1 > 0
                                    ? sommerjobbAd.explanation.value.toFixed(2)
                                    : sommerjobbAd.explanation.value}
                            </BodyShort>
                        </Box>
                        <DebugExplain explanation={sommerjobbAd.explanation} />
                    </HStack>
                )}
            </VStack>
        </Box>
    );
}

export default DebugItem;
