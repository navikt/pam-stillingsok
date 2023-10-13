import React from "react";
import { BodyLong, Button, Heading, VStack } from "@navikt/ds-react";
import { FigureHoldingAHeart } from "@navikt/arbeidsplassen-react";
import { Link } from "react-router-dom";
import { CONTEXT_PATH } from "../../common/environment";

function NoFavourites() {
    return (
        <section className="container-small mt-16 mb-16">
            <VStack align="center">
                <FigureHoldingAHeart className="mb-8" />
                <Heading level="1" size="large" className="text-center" spacing>
                    Du har ikke lagret noen favoritter ennå
                </Heading>
                <BodyLong className="text-center" spacing>
                    Ikke har tid til å lese annonsen akkurat nå, eller lyst å søke først senere når du kommer hjem? Med
                    favoritter finner du raskt tilbake til annonsen.
                </BodyLong>
                <BodyLong className="text-center" spacing>
                    Du kan markere annonser som favoritter både fra søket og inne i annonsen.
                </BodyLong>
                <Button variant="primary" as={Link} to={CONTEXT_PATH}>
                    Gå til søket
                </Button>
            </VStack>
        </section>
    );
}

export default NoFavourites;
