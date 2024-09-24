import React, { ReactElement } from "react";
import { BodyShort, Box, Heading, VStack } from "@navikt/ds-react";
import SaveSearchButton from "@/app/lagrede-sok/_components/SaveSearchButton";

export default function DoYouWantToSaveSearch(): ReactElement {
    return (
        <Box padding={{ xs: "4", md: "6" }} borderRadius="small" background="surface-alt-2-subtle">
            <VStack align="center">
                <Heading level="3" size="small" className="text-center" spacing>
                    Varsel ved nye treff?
                </Heading>
                <BodyShort className="text-center" spacing>
                    Lagre søket og motta e-post ved nye treff.
                </BodyShort>
                <SaveSearchButton />
            </VStack>
        </Box>
    );
}
