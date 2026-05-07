import React from "react";
import { BodyLong, Box, Heading } from "@navikt/ds-react";
import SkyraSurvey from "@/app/_common/skyra/SkyraSurvey";

function GiveFeedback() {
    return (
        <Box className="mt-12 mb-12 bg-brand-blue-subtle" padding="space-16" borderRadius="8">
            <Heading size="medium" level="2" spacing>
                Hvordan kan vi forbedre denne tjenesten for deg?
            </Heading>
            <BodyLong spacing>
                Vi vil gjerne høre hva som var enkelt og hva som kan bli bedre. Det tar under 1 minutt.
            </BodyLong>
            <SkyraSurvey
                buttonVariant="secondary"
                buttonText="Skriv en kort tilbakemelding"
                skyraSlug="arbeids-og-velferdsetaten-nav/tilbakemelding-superrask-soknad-jobbsoker"
            />
        </Box>
    );
}

export default GiveFeedback;
