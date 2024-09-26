import React, { ReactElement } from "react";
import { BodyShort, Box, HStack, VStack } from "@navikt/ds-react";
import { useSearchParams } from "next/navigation";
import { SEARCH_STRING } from "@/app/(sok)/_components/searchParamNames";
import { mediumDisplayName } from "@/app/_common/utils/utils";
import { SearchResultAd } from "@/app/(sok)/_types/SearchResult";
import { SurfaceColorToken } from "@navikt/ds-react/src/layout/utilities/types";

interface GroupItemProps {
    children: React.ReactNode;
    color?: SurfaceColorToken | undefined;
    semibold?: boolean;
}

function GroupItem({ children, color = "surface-neutral-subtle", semibold = false }: GroupItemProps): ReactElement {
    return (
        <Box background={color} paddingBlock="05" paddingInline="2" borderRadius="small">
            <BodyShort size="small" weight={semibold ? "semibold" : "regular"}>
                {children}
            </BodyShort>
        </Box>
    );
}

interface DebugProps {
    ad: SearchResultAd;
}

export default function Debug({ ad }: DebugProps): ReactElement {
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
            {searchParams.has(SEARCH_STRING) && (
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
                    <GroupItem color={ad.medium === "Stillingsregistrering" ? "surface-danger-subtle" : undefined}>
                        {mediumDisplayName(ad.medium)}
                    </GroupItem>
                </HStack>
            )}
        </VStack>
    );
}