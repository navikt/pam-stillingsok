import React from "react";
import { BodyLong, Heading, VStack } from "@navikt/ds-react";
import { FigureHoldingAHeart } from "@navikt/arbeidsplassen-react";
import { PageBlock } from "@navikt/ds-react/Page";
import { NextButtonLink } from "@/app/_common/components/NextButtonLink/NextButtonLink";

function NoFavourites() {
    return (
        <PageBlock width="md" gutters className="mt-16 mb-16">
            <VStack align="center">
                <FigureHoldingAHeart className="mb-8" />
                <Heading level="1" size="large" className="text-center" spacing>
                    Du har ikke lagret noen favoritter ennå
                </Heading>
                <BodyLong className="text-center" spacing>
                    Har du ikke tid til å lese annonsen akkurat nå, eller lyst til å søke senere når du kommer hjem? Med
                    favoritter finner du raskt tilbake til annonsen.
                </BodyLong>
                <BodyLong className="text-center" spacing>
                    Du kan markere annonser som favoritter både fra søket og inne i annonsen.
                </BodyLong>
                <NextButtonLink href="/stillinger">Gå til søket</NextButtonLink>
            </VStack>
        </PageBlock>
    );
}

export default NoFavourites;
