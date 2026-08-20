import { Heading, HStack, Tag } from "@navikt/ds-react";
import type { TipHeadingParagraph } from "@/app/innholdsmodul-demo/_data/types";

type Props = {
    paragraph: TipHeadingParagraph;
};

export default function TipHeadingModule({ paragraph }: Props) {
    return (
        <HStack gap="space-2" align="center">
            <span
                aria-hidden="true"
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "2rem",
                    minHeight: "2rem",
                    borderRadius: "50%",
                    background: "var(--a-surface-action)",
                    color: "var(--a-text-on-action)",
                    fontWeight: "var(--a-font-weight-bold)",
                    fontSize: "var(--a-font-size-heading-small)",
                }}
            >
                {paragraph.number}
            </span>
            <Heading size="medium" level="2">
                {paragraph.text}{" "}
                <Tag variant="warning" size="xsmall" style={{ alignSelf: "flex-start" }}>
                    TipHeadingModule
                </Tag>
            </Heading>
        </HStack>
    );
}
