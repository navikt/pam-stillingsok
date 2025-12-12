import React from "react";
import { Heading, VStack } from "@navikt/ds-react";
import { WorriedFigure } from "@navikt/arbeidsplassen-react";
import { PageBlock } from "@navikt/ds-react/Page";

export default function IkkeTilgang() {
    return (
        <PageBlock as="section" width="md" className="mt-16 mb-16">
            <VStack align="center">
                <WorriedFigure className="mb-8" />
                <Heading level="1" size="large" className="text-center" spacing>
                    Du har ikke tilgang til å ta i bruk de innloggede tjenestene
                </Heading>
            </VStack>
        </PageBlock>
    );
}
