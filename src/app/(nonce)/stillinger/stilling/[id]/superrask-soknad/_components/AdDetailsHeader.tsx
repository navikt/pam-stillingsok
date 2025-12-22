import React, { ReactElement } from "react";
import { BodyShort, Box, Label } from "@navikt/ds-react";
import { type AdDTO } from "@/app/(nonce)/stillinger/_common/lib/ad-model";
import { PageBlock } from "@navikt/ds-react/Page";

interface AdDetailsHeaderProps {
    source: AdDTO;
}

function AdDetailsHeader({ source }: AdDetailsHeaderProps): ReactElement {
    return (
        <Box background="surface-alt-1-subtle" paddingBlock="4" className="mb-10">
            <PageBlock as="div" width="lg" gutters>
                <Label as="p" className="mb-1">
                    {source.employer.name}
                </Label>
                <BodyShort>{source.title}</BodyShort>{" "}
            </PageBlock>
        </Box>
    );
}

export default AdDetailsHeader;
