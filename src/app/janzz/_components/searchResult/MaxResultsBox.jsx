import React from "react";
import { BodyShort, Box, Heading, HStack } from "@navikt/ds-react";
import DetectiveIcon from "../icons/DetectiveIcon";

function MaxResultsBox() {
    return (
        <Box padding={{ xs: "4", md: "6" }} borderRadius="small" background="surface-alt-1-subtle">
            <HStack wrap={false} justify="center" align="center" gap="2">
                <Box>
                    <Heading level="3" size="small" spacing>
                        Du har nådd maks antall annonser for ditt søk
                    </Heading>
                    <BodyShort spacing>
                        Utvid søket ditt ved å prøve andre filtre eller søkeord for å oppdage flere annonser.
                    </BodyShort>
                </Box>

                <Box paddingInline="4">
                    <DetectiveIcon />
                </Box>
            </HStack>
        </Box>
    );
}

export default MaxResultsBox;
