import React, { ReactElement } from "react";
import { BodyLong, Box, Heading } from "@navikt/ds-react";
import { SommerjobbAd } from "@/app/sommerjobb/_components/Sommerjobb";

interface SommerjobbItemProps {
    sommerjobbAd: SommerjobbAd;
}

function SommerjobbItem({ sommerjobbAd }: SommerjobbItemProps): ReactElement {
    return (
        <Box padding="space-4" shadow="small">
            <Heading size="small" level="3">
                {sommerjobbAd.title}
            </Heading>

            <BodyLong>{sommerjobbAd.description}</BodyLong>
            <BodyLong>{sommerjobbAd.employerName}</BodyLong>
            <BodyLong>{sommerjobbAd.location}</BodyLong>
            <BodyLong>{sommerjobbAd.applicationDueDate}</BodyLong>
        </Box>
    );
}

export default SommerjobbItem;
