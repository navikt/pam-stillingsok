import { FigureHoldingAHeart } from '@navikt/arbeidsplassen-react';
import {
  BodyLong, Button, Heading, VStack,
} from '@navikt/ds-react';
import Link from 'next/link';
import React from 'react';

const NoFavourites = () => (
  <section className="container-small mt-16 mb-16">
    <VStack align="center">
      <FigureHoldingAHeart className="mb-8" />
      <Heading spacing className="text-center" level="1" size="large">
        Du har ikke lagret noen favoritter ennå
      </Heading>
      <BodyLong spacing className="text-center">
        Har du ikke tid til å lese annonsen akkurat nå, eller lyst til å søke senere når du kommer hjem? Med
        favoritter finner du raskt tilbake til annonsen.
      </BodyLong>
      <BodyLong spacing className="text-center">
        Du kan markere annonser som favoritter både fra søket og inne i annonsen.
      </BodyLong>
      <Button as={Link} href="/" role="link" variant="primary">
        Gå til søket
      </Button>
    </VStack>
  </section>
);

export default NoFavourites;
