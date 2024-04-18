import { BodyLong, Button, Heading } from '@navikt/ds-react';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';

import GiveFeedback from '@/app/stilling/[id]/superrask-soknad/_components/GiveFeedback';

function WithdrawApplicationSuccess() {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  return (
    <>
      <Heading ref={ref} spacing aria-live="polite" level="1" role="alert" size="large" tabIndex={-1}>
        Din søknad er nå trukket
      </Heading>

      <BodyLong className="mb-10">
        Informasjonen du oppgav i din søknad er slettet. Dersom du angrer på at du trakk søknaden, kan du søke
        på nytt.
      </BodyLong>
      <Button as={Link} href="/" variant="secondary">
        Se ledige stillinger
      </Button>

      <GiveFeedback />
    </>
  );
}

export default WithdrawApplicationSuccess;
