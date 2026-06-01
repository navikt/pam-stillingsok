import { Tag } from "@navikt/ds-react";
import type { SpacerParagraph } from "@/app/innholdsmodul-demo/_data/types";

type Props = {
    paragraph: SpacerParagraph;
};

export default function SpacerModule({ paragraph: _ }: Props) {
    return (
        <>
            <Tag variant="warning" size="xsmall" style={{ alignSelf: "flex-start" }}>
                SpacerModule
            </Tag>
            <div style={{ marginBlock: "var(--a-spacing-8)" }} aria-hidden="true" />{" "}
        </>
    );
}
