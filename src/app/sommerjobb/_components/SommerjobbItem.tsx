import React, { ReactElement } from "react";
import { BodyShort, Box, Heading } from "@navikt/ds-react";
import { SommerjobbAd } from "@/app/sommerjobb/_components/Sommerjobb";

interface SommerjobbItemProps {
    sommerjobbAd: SommerjobbAd;
}

function SommerjobbItem({ sommerjobbAd }: SommerjobbItemProps): ReactElement {
    return (
        <Box padding="6" shadow="small" background="surface-default">
            <Heading size="small" level="3" spacing>
                {sommerjobbAd.title}
            </Heading>

            <BodyShort spacing>{sommerjobbAd.description}</BodyShort>
            <BodyShort spacing>{sommerjobbAd.employerName}</BodyShort>
            <BodyShort spacing>{sommerjobbAd.location}</BodyShort>
            <BodyShort>{sommerjobbAd.applicationDueDate}</BodyShort>
        </Box>
    );
}

export default SommerjobbItem;
