import React, { ReactElement } from "react";
import { BodyLong, Box, Heading } from "@navikt/ds-react";
import SkyraSurveyMuligheter from "@/app/muligheter/mulighet/[id]/meld-interesse/_components/SkyraSurveyMuligheter";

function GiveFeedbackMuligheter(): ReactElement {
    return (
        <Box borderRadius="2" className="mt-12">
            <Heading level="2" size="small" spacing>
                Hvordan kan vi forbedre denne tjenesten for deg?
            </Heading>
            <BodyLong spacing>
                Vi setter pris på tilbakemeldingen din. Er det noe du savner eller noe vi kan gjøre bedre?
            </BodyLong>

            <SkyraSurveyMuligheter />
        </Box>
    );
}

export default GiveFeedbackMuligheter;
