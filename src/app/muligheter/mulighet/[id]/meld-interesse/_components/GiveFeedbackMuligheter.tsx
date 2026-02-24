import React, { ReactElement } from "react";
import { BodyLong, Box, Heading, Stack } from "@navikt/ds-react";
import SkyraSurveyMuligheter from "@/app/muligheter/mulighet/[id]/meld-interesse/_components/SkyraSurveyMuligheter";
import FigureWithHeart from "@/app/muligheter/mulighet/[id]/meld-interesse/_components/FigureWithHeart";

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

            <Stack justify="center">
                <FigureWithHeart />
            </Stack>
        </Box>
    );
}

export default GiveFeedbackMuligheter;
