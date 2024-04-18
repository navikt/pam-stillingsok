'use client';

import { FigureJugglingShieldWithCheckmark } from '@navikt/arbeidsplassen-react';
import {
  BodyLong, Button, Heading, VStack,
} from '@navikt/ds-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import UserConsentModal from '../../_common/user/UserConsentModal';

function UserConsentIsRequired() {
  const [showTermsModal, setShowTermModal] = useState(false);
  const router = useRouter();

  return (
    <section className="container-small mt-16 mb-16">
      <VStack align="center">
        <FigureJugglingShieldWithCheckmark className="mb-8" />

        <Heading spacing className="text-center" level="1" size="large">
          Du må samtykke for å kunne ta i bruk favoritter
        </Heading>
        <BodyLong spacing className="text-center">
          Har du ikke tid til å lese annonsen akkurat nå, eller lyst til å søke senere når du kommer hjem? Med
          favoritter finner du raskt tilbake til annonsen.
        </BodyLong>
        <Button
          variant="primary"
          onClick={() => {
            setShowTermModal(true);
          }}
        >
          Se samtykke
        </Button>
      </VStack>

      {showTermsModal ? (
        <UserConsentModal
          onClose={() => {
            setShowTermModal(false);
          }}
          onTermsAccepted={() => {
            router.refresh();
          }}
        />
      ) : null}
    </section>
  );
}

export default UserConsentIsRequired;
