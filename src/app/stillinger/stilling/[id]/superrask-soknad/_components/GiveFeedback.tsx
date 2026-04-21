import React from "react";
import { Box, InfoCard } from "@navikt/ds-react";
import SkyraSurvey from "@/app/_common/skyra/SkyraSurvey";
import { InfoCardContent, InfoCardHeader, InfoCardTitle } from "@navikt/ds-react/InfoCard";

function GiveFeedback() {
    return (
        <Box className="mt-12 mb-12">
            <InfoCard data-color="success" as="section" className="mb-8" aria-label="Informasjon om tilbakemeldinger">
                <InfoCardHeader>
                    <InfoCardTitle>Hvordan kan vi forbedre denne tjenesten for deg?</InfoCardTitle>
                </InfoCardHeader>
                <InfoCardContent>
                    Vi vil gjerne høre hva som var enkelt og hva som kan bli bedre. Det tar under 1 minutt.
                </InfoCardContent>
            </InfoCard>
            <SkyraSurvey
                buttonVariant="primary"
                buttonText="Skriv en kort tilbakemelding"
                skyraSlug="arbeids-og-velferdsetaten-nav/tilbakemelding-superrask-soknad-jobbsoker"
            />
        </Box>
    );
}

export default GiveFeedback;
