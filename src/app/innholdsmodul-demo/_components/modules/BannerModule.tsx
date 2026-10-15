import { BodyShort, Box, Heading, Link, Tag, VStack } from "@navikt/ds-react";
import type { BannerParagraph } from "@/app/innholdsmodul-demo/_data/speculativeTypes";

type Props = {
    paragraph: BannerParagraph;
};

export default function BannerModule({ paragraph }: Props) {
    return (
        <VStack gap="space-2">
            <Tag variant="error" size="xsmall" style={{ alignSelf: "flex-start" }}>
                SPEKULATIBV — BannerModule
            </Tag>
            <Box background="warning-soft" padding="space-12" borderRadius="4">
                <VStack gap="space-4">
                    <Heading size="large" level="2">
                        {paragraph.title}
                    </Heading>
                    <BodyShort>{paragraph.body}</BodyShort>
                    {paragraph.linkHref && paragraph.linkText && (
                        <Link href={paragraph.linkHref}>{paragraph.linkText}</Link>
                    )}
                </VStack>
            </Box>
        </VStack>
    );
}
