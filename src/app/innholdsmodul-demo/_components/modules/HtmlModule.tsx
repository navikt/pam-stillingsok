import { Tag } from "@navikt/ds-react";
import type { HtmlParagraph } from "@/app/innholdsmodul-demo/_data/types";

type Props = {
    paragraph: HtmlParagraph;
};

export default function HtmlModule({ paragraph }: Props) {
    return (
        <>
            <Tag variant="warning" size="xsmall" style={{ alignSelf: "flex-start" }}>
                HtmlModule
            </Tag>
            {/** biome-ignore lint/security/noDangerouslySetInnerHtml: Good for now */}
            <div className="navds-body-short" dangerouslySetInnerHTML={{ __html: paragraph.html }} />
        </>
    );
}
