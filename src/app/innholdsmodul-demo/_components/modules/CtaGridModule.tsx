import { Heading, LinkPanel, Tag, VStack } from "@navikt/ds-react";
import { LinkPanelDescription, LinkPanelTitle } from "@navikt/ds-react/LinkPanel";
import type { CtaGridParagraph } from "@/app/innholdsmodul-demo/_data/speculativeTypes";

type Props = {
    paragraph: CtaGridParagraph;
};

export default function CtaGridModule({ paragraph }: Props) {
    return (
        <VStack gap="space-4">
            <Tag variant="error" size="xsmall" style={{ alignSelf: "flex-start" }}>
                SPEKULATIBV — CtaGridModule
            </Tag>
            {paragraph.heading && (
                <Heading size="medium" level="2">
                    {paragraph.heading}
                </Heading>
            )}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                    gap: "var(--a-spacing-4)",
                }}
            >
                {paragraph.items.map((item) => (
                    <LinkPanel key={item.href} href={item.href} border>
                        <LinkPanelTitle>{item.title}</LinkPanelTitle>
                        <LinkPanelDescription>{item.description}</LinkPanelDescription>
                    </LinkPanel>
                ))}
            </div>
        </VStack>
    );
}
