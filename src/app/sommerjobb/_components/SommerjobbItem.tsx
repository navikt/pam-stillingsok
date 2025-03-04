import React, { ReactElement } from "react";
import { BodyShort, Box, Heading } from "@navikt/ds-react";
import { SommerjobbAd } from "@/app/sommerjobb/_components/SommerjobbResults";

interface SommerjobbItemProps {
    sommerjobbAd: SommerjobbAd;
}

function SommerjobbItem({ sommerjobbAd }: SommerjobbItemProps): ReactElement {
    return (
        <Box as="article" padding="6" shadow="small" background="surface-default" borderRadius="small">
            <Heading size="small" level="3" spacing>
                {sommerjobbAd.title}
            </Heading>

            <BodyShort spacing>{sommerjobbAd.description}</BodyShort>
            <BodyShort spacing>{sommerjobbAd.employerName}</BodyShort>
            <BodyShort spacing>{sommerjobbAd.location}</BodyShort>
            <BodyShort>{sommerjobbAd.applicationDue}</BodyShort>
        </Box>
    );
}

export default SommerjobbItem;
