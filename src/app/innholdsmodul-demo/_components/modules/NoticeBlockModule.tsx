import { Alert, Tag, VStack } from "@navikt/ds-react";
import type { NoticeBlockParagraph } from "@/app/innholdsmodul-demo/_data/speculativeTypes";

type Props = {
    paragraph: NoticeBlockParagraph;
};

export default function NoticeBlockModule({ paragraph }: Props) {
    return (
        <VStack gap="space-2">
            <Tag variant="error" size="xsmall" style={{ alignSelf: "flex-start" }}>
                SPEKULATIBV — NoticeBlockModule
            </Tag>
            <Alert variant={paragraph.variant} title={paragraph.title}>
                {paragraph.body}
            </Alert>
        </VStack>
    );
}
