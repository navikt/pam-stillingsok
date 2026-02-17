import React, { ReactElement } from "react";
import { BodyLong, Box, Heading } from "@navikt/ds-react";
import SkyraSurveyMuligheter from "@/app/muligheter/mulighet/[id]/meld-interesse/_components/SkyraSurveyMuligheter";

function GiveFeedbackInternal(): ReactElement {
    return (
        <Box borderRadius="2" className="mt-12">
            <Heading level="2" size="small" spacing>
                Hvordan kan vi forbedre denne tjenesten for deg?
            </Heading>
            <BodyLong spacing>
                Vi setter stor pris på dine tilbakemeldinger dersom det er noe du savner eller noe du synes kunne vært
                bedre med denne tjenesten.
            </BodyLong>

            <SkyraSurveyMuligheter />
        </Box>
    );
}

export default GiveFeedbackInternal;
