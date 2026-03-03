import React from "react";
import { BodyShort, Box } from "@navikt/ds-react";
import { type AdDTO } from "@/app/stillinger/_common/lib/ad-model";
import { PageBlock } from "@navikt/ds-react/Page";

interface AdDetailsHeaderProps {
    source: AdDTO;
}

function AdDetailsHeader({ source }: AdDetailsHeaderProps) {
    return (
        <Box paddingBlock="space-16" className="mb-10 bg-brand-green-subtle">
            <PageBlock as="div" width="lg" gutters>
                <BodyShort weight="semibold" className="mb-1">
                    {source.employer.name}
                </BodyShort>
                <BodyShort>{source.title}</BodyShort>{" "}
            </PageBlock>
        </Box>
    );
}

export default AdDetailsHeader;
