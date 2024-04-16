'use client';

import { EnterIcon } from '@navikt/aksel-icons';
import { FigureWithKey } from '@navikt/arbeidsplassen-react';
import {
  BodyLong, Button, HStack, Heading, VStack,
} from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';

import { AuthenticationContext } from '@/app/_common/auth/contexts/AuthenticationProvider';

const LoginIsRequiredPage = ({ redirect = '/stillinger' }) => {
  const { loginAndRedirect } = useContext(AuthenticationContext);

  const onLogin = () => {
    loginAndRedirect(redirect);
  };

  return (
    <section className="container-small mt-12 mb-12">
      <VStack align="center">
        <Heading spacing className="text-center" level="1" size="large">
          Du må logge inn først
        </Heading>
        <BodyLong spacing className="text-center">
          Du bruker BankID for å logge inn på
          {' '}
          <span translate="no">arbeidsplassen.no</span>
        </BodyLong>
        <FigureWithKey className="mb-8" />

        <HStack gap="4">
          <Button icon={<EnterIcon aria-hidden="true" />} variant="primary" onClick={onLogin}>
            Logg inn
          </Button>
        </HStack>
      </VStack>
    </section>
  );
};

LoginIsRequiredPage.propTypes = {
  redirect: PropTypes.string,
};

export default LoginIsRequiredPage;
