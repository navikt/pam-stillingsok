'use client';

import { FigureJugglingShieldWithCheckmark } from '@navikt/arbeidsplassen-react';
import {
  BodyLong, Button, Heading, VStack,
} from '@navikt/ds-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import UserConsentModal from '@/app/_common/user/UserConsentModal';

const UserConsentIsRequired = () => {
  const [showTermsModal, setShowTermModal] = useState(false);
  const router = useRouter();

  return (
    <section className="container-small mt-16 mb-16">
      <VStack align="center">
        <FigureJugglingShieldWithCheckmark className="mb-8" />
        <Heading spacing className="text-center" level="1" size="large">
          Du må samtykke for å kunne ta i bruk lagrede søk
        </Heading>
        <BodyLong spacing className="text-center">
          Med lagrede søk kan du velge å motta e-postvarsler når det kommer nye treff, eller for å raskere
          søke neste gang.
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
};

export default UserConsentIsRequired;
