import { Heading, HGrid, LinkCard, Tag, VStack } from "@navikt/ds-react";
import { LinkCardAnchor, LinkCardDescription, LinkCardTitle } from "@navikt/ds-react/LinkCard";
import type { CtaGridParagraph } from "@/app/innholdsmodul-demo/_data/types";

type Props = {
    paragraph: CtaGridParagraph;
};

export default function CtaGridModule({ paragraph }: Props) {
    return (
        <div>
            <Tag variant="warning" size="xsmall" style={{ alignSelf: "flex-start" }}>
                CtaGridModule
            </Tag>
            <VStack gap="space-4">
                {paragraph.heading && (
                    <Heading size="medium" level="2">
                        {paragraph.heading}
                    </Heading>
                )}
                <HGrid columns={{ xs: 1, sm: 2, lg: 4 }} gap="space-4">
                    {paragraph.items.map((item) => (
                        <LinkCard key={item.href}>
                            <LinkCardTitle>
                                <LinkCardAnchor href={item.href}>{item.title}</LinkCardAnchor>
                            </LinkCardTitle>
                            <LinkCardDescription>{item.description}</LinkCardDescription>
                        </LinkCard>
                    ))}
                </HGrid>
            </VStack>
        </div>
    );
}
