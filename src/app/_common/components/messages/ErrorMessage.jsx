import React from "react";
import { BodyLong, Heading, VStack } from "@navikt/ds-react";

function ErrorMessage() {
    return (
        <VStack align="center" className="mb-16 mt-16" role="alert">
            <Heading level="2" size="medium" className="text-center" spacing>
                Det oppsto en feil
            </Heading>
            <BodyLong className="text-center">Forsøk å laste inn siden på nytt</BodyLong>
        </VStack>
    );
}

export default ErrorMessage;
