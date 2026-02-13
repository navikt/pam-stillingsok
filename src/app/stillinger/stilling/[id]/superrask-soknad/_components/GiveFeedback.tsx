import React from "react";
import { BodyLong, Box, Heading } from "@navikt/ds-react";
import SkyraSurvey from "@/app/_common/skyra/SkyraSurvey";

function GiveFeedback() {
    return (
        <Box padding={{ xs: "space-16", md: "space-24" }} borderRadius="2" className="bg-brand-blue-subtle mt-12">
            <Heading level="2" size="medium" spacing>
                Hvordan kan vi forbedre denne tjenesten for deg?
            </Heading>
            <BodyLong spacing>
                Vi setter stor pris på dine tilbakemeldinger dersom det er noe du savner eller noe du synes kunne vært
                bedre med denne tjenesten.
            </BodyLong>
            <SkyraSurvey
                buttonText="Skriv en kort tilbakemelding"
                skyraSlug="arbeids-og-velferdsetaten-nav/tilbakemelding-superrask-soknad-jobbsoker"
            />
        </Box>
    );
}

export default GiveFeedback;
