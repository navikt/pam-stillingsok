import { FigureWithMagnifier } from '@navikt/arbeidsplassen-react';
import {
  BodyLong, Button, Heading, VStack,
} from '@navikt/ds-react';
import Link from 'next/link';
import React from 'react';

const NoSavedSearches = () => (
  <section className="container-small mt-16 mb-16">
    <VStack align="center">
      <FigureWithMagnifier className="mb-8" />
      <Heading spacing className="text-center" level="1" size="large">
        Du har ikke lagret noen søk ennå
      </Heading>
      <BodyLong spacing className="text-center">
        Med lagrede søk kan du velge å motta e-postvarsler når det kommer nye treff, eller for å raskere
        søke neste gang.
      </BodyLong>
      <BodyLong spacing className="text-center">
        Du kan velge å lagre ditt søk når du har fylt inn søkeord eller andre filter.
      </BodyLong>
      <Button as={Link} href="/" role="link" variant="primary">
        Gå til søket
      </Button>
    </VStack>
  </section>
);

export default NoSavedSearches;
