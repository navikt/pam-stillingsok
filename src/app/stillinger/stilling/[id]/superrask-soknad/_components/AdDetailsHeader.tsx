import { BodyShort, Box, VStack } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/Page";
import type { AdDTO } from "@/app/stillinger/_common/lib/ad-model";

type AdDetailsHeaderProps = {
    source: AdDTO;
};

export default function AdDetailsHeader({ source }: AdDetailsHeaderProps) {
    return (
        <Box paddingBlock="space-16" className="bg-brand-green-subtle">
            <PageBlock width="md" gutters>
                <VStack gap="space-4">
                    <BodyShort weight="semibold">{source.employer.name}</BodyShort>
                    <BodyShort>{source.title}</BodyShort>
                </VStack>
            </PageBlock>
        </Box>
    );
}
