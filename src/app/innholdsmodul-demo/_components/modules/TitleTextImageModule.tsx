import { Box, Heading, HGrid, Tag } from "@navikt/ds-react";
import type { TitleTextImageParagraph } from "@/app/innholdsmodul-demo/_data/types";

type Props = {
    paragraph: TitleTextImageParagraph;
};

export default function TitleTextImageModule({ paragraph }: Props) {
    const imageOnRight = paragraph.layout === "img_right";

    return (
        <>
            {" "}
            <Tag variant="warning" size="xsmall" style={{ alignSelf: "flex-start" }}>
                TitleTextImageModule {paragraph.type}
            </Tag>
            <HGrid columns={{ xs: 1, md: 2 }} gap="space-8" align="start">
                {!imageOnRight && <ImagePlaceholder />}
                <Box>
                    {paragraph.title && (
                        <Heading size="small" level="3" spacing>
                            {paragraph.title}
                        </Heading>
                    )}
                    {/** biome-ignore lint/security/noDangerouslySetInnerHtml: annen løsning dersom dette skal brukes */}
                    <div className="navds-body-short" dangerouslySetInnerHTML={{ __html: paragraph.html }} />
                </Box>
                {imageOnRight && <ImagePlaceholder />}
            </HGrid>
        </>
    );
}

function ImagePlaceholder() {
    return (
        <Box
            background="neutral-soft"
            borderRadius="4"
            padding="space-24"
            style={{ minHeight: "10rem", display: "flex", alignItems: "center", justifyContent: "center" }}
            aria-hidden="true"
        >
            <Tag variant="neutral" size="small">
                Bilde fra CMS
            </Tag>
        </Box>
    );
}
