import React, { ReactElement } from "react";
import { BodyShort, Box, Label } from "@navikt/ds-react";
import getEmployer from "@/app/_common/utils/getEmployer";

interface AdDetailsHeaderProps {
    source: {
        title: string;
    };
}

function AdDetailsHeader({ source }: AdDetailsHeaderProps): ReactElement {
    return (
        <Box background="surface-alt-1-subtle" paddingBlock="4" className="mb-10">
            <div className="container-medium">
                <Label as="p" className="mb-1">
                    {getEmployer(source)}
                </Label>
                <BodyShort>{source.title}</BodyShort>
            </div>
        </Box>
    );
}

export default AdDetailsHeader;
