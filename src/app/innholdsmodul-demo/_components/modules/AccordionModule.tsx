"use client";

import { Accordion, Tag } from "@navikt/ds-react";
import type { AccordionParagraph } from "@/app/innholdsmodul-demo/_data/types";

type Props = {
    paragraph: AccordionParagraph;
};

export default function AccordionModule({ paragraph }: Props) {
    return (
        <div>
            <Tag variant="warning" size="xsmall" style={{ alignSelf: "flex-start" }}>
                AccordionModule
            </Tag>
            <Accordion>
                {paragraph.items.map((item) => (
                    <Accordion.Item key={item.title}>
                        <Accordion.Header>{item.title}</Accordion.Header>
                        <Accordion.Content>
                            {/** biome-ignore lint/security/noDangerouslySetInnerHtml: annen løsning dersom dette skal brukes */}
                            <div className="navds-body-short" dangerouslySetInnerHTML={{ __html: item.html }} />
                        </Accordion.Content>
                    </Accordion.Item>
                ))}
            </Accordion>
        </div>
    );
}
