import React from "react";
import { BodyLong, Heading, VStack } from "@navikt/ds-react";
import { WorriedFigure } from "@navikt/arbeidsplassen-react";
import { PageBlock } from "@navikt/ds-react/Page";

export default function UngIkkeTilgang() {
    return (
        <PageBlock as="section" width="md" className="mt-16 mb-16">
            <VStack align="center">
                <WorriedFigure className="mb-8" />
                <Heading level="1" size="large" className="text-center" spacing>
                    Du er dessverre for ung for å ta i bruk de innloggede tjenestene
                </Heading>
                <BodyLong className="text-center" spacing>
                    Man må være over 15 år for å kunne ta i bruk de innloggede tjenestene. Vi beklager dette og håper du
                    vil komme tilbake ved en senere anledning.
                </BodyLong>
            </VStack>
        </PageBlock>
    );
}
