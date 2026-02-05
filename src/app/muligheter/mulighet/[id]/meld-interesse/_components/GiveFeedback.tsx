import React, { ReactElement } from "react";
import { BodyLong, Box, Heading } from "@navikt/ds-react";
import SkyraSurvey from "@/app/_common/skyra/SkyraSurvey";

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

            {/* TODO: LAG NY SKYRA OM VI SKAL HA SKYRA */}
            <SkyraSurvey
                buttonText="Skriv en kort tilbakemelding"
                skyraSlug="arbeids-og-velferdsetaten-nav/tilbakemelding-superrask-soknad-jobbsoker"
            />
        </Box>
    );
}

export default GiveFeedback;
