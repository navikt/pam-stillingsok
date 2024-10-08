import React, { ReactElement } from "react";
import { BodyLong, Box, Heading, Link as AkselLink } from "@navikt/ds-react";

function GiveFeedback(): ReactElement {
    return (
        <Box padding={{ xs: "4", md: "6" }} borderRadius="small" background="surface-alt-3-subtle" className="mt-12">
            <Heading level="2" size="medium" spacing>
                Hvordan kan vi forbedre denne tjenesten for deg?
            </Heading>
            <BodyLong spacing>
                Vi setter stor pris på dine tilbakemeldinger dersom det er noe du savner eller noe du synes kunne vært
                bedre med denne tjenesten.
            </BodyLong>
            <BodyLong>
                <AkselLink href="https://surveys.hotjar.com/096eea6f-8509-467b-b627-20b40340d1f8">
                    Skriv en kort tilbakemelding
                </AkselLink>
            </BodyLong>
        </Box>
    );
}

export default GiveFeedback;
