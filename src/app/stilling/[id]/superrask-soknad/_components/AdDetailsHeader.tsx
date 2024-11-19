import React, { ReactElement } from "react";
import { BodyShort, Box, Label } from "@navikt/ds-react";
import getEmployerName from "@/app/_common/utils/getEmployerName";
import { StillingDetaljer } from "@/app/lib/stillingSchema";

interface AdDetailsHeaderProps {
    source: StillingDetaljer;
}

function AdDetailsHeader({ source }: AdDetailsHeaderProps): ReactElement {
    return (
        <Box background="surface-alt-1-subtle" paddingBlock="4" className="mb-10">
            <div className="container-medium">
                <Label as="p" className="mb-1">
                    {getEmployerName(source)}
                </Label>
                <BodyShort>{source.title}</BodyShort>
            </div>
        </Box>
    );
}

export default AdDetailsHeader;
