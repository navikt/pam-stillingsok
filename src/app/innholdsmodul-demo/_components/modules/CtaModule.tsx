import { Heading, LinkPanel, Tag, VStack } from "@navikt/ds-react";
import { LinkCardDescription } from "@navikt/ds-react/LinkCard";
import { LinkPanelTitle } from "@navikt/ds-react/LinkPanel";
import type { CtaParagraph } from "@/app/innholdsmodul-demo/_data/speculativeTypes";

type Props = {
    paragraph: CtaParagraph;
};

export default function CtaModule({ paragraph }: Props) {
    return (
        <VStack gap="space-2">
            <Tag variant="error" size="xsmall" style={{ alignSelf: "flex-start" }}>
                SPEKULATIBV — CtaModule
            </Tag>
            <LinkPanel href={paragraph.href} border>
                <LinkPanelTitle as={Heading} size="small">
                    {paragraph.title}
                </LinkPanelTitle>
                <LinkCardDescription>{paragraph.description}</LinkCardDescription>
            </LinkPanel>
        </VStack>
    );
}
