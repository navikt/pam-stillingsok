import React, { ReactElement } from "react";
import { BodyShort, Box, Label } from "@navikt/ds-react";
import { type AdDTO } from "@/app/stillinger/_common/lib/ad-model";

interface AdDetailsHeaderProps {
    source: AdDTO;
}

function AdDetailsHeader({ source }: AdDetailsHeaderProps): ReactElement {
    return (
        <Box background="surface-alt-1-subtle" paddingBlock="4" className="mb-10">
            <div className="container-medium">
                <Label as="p" className="mb-1">
                    {source.employer.name}
                </Label>
                <BodyShort>{source.title}</BodyShort>
            </div>
        </Box>
    );
}

export default AdDetailsHeader;
