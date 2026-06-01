import { LinkCard, Tag } from "@navikt/ds-react";
import { LinkCardAnchor, LinkCardDescription, LinkCardTitle } from "@navikt/ds-react/LinkCard";
import type { CtaParagraph } from "@/app/innholdsmodul-demo/_data/types";

type Props = {
    paragraph: CtaParagraph;
};

export default function CtaModule({ paragraph }: Props) {
    return (
        <div>
            <Tag variant="warning" size="xsmall" style={{ alignSelf: "flex-start" }}>
                CtaModule
            </Tag>
            <LinkCard>
                <LinkCardTitle>
                    <LinkCardAnchor href={paragraph.href}>{paragraph.title}</LinkCardAnchor>
                </LinkCardTitle>
                <LinkCardDescription>{paragraph.description}</LinkCardDescription>
            </LinkCard>
        </div>
    );
}
