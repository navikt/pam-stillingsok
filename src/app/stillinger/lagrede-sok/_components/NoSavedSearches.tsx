import React, { ReactElement } from "react";
import { BodyLong, Button, Heading, VStack } from "@navikt/ds-react";
import { FigureWithMagnifier } from "@navikt/arbeidsplassen-react";
import Link from "next/link";

function NoSavedSearches(): ReactElement {
    return (
        <section className="container-small mt-16 mb-16">
            <VStack align="center">
                <FigureWithMagnifier className="mb-8" />
                <Heading level="1" size="large" className="text-center" spacing>
                    Du har ikke lagret noen søk ennå
                </Heading>
                <BodyLong className="text-center" spacing>
                    Med lagrede søk kan du velge å motta e-postvarsler når det kommer nye treff, eller for å raskere
                    søke neste gang.
                </BodyLong>
                <BodyLong className="text-center" spacing>
                    Du kan velge å lagre ditt søk når du har fylt inn søkeord eller andre filter.
                </BodyLong>
                <Button variant="primary" as={Link} role="link" href="/stillinger">
                    Gå til søket
                </Button>
            </VStack>
        </section>
    );
}

export default NoSavedSearches;
