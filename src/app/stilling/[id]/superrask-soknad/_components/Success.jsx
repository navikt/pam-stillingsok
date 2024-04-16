import { BodyLong, Button, Heading } from '@navikt/ds-react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';

import GiveFeedback from './GiveFeedback';

const Success = ({ email }) => {
  const ref = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  return (
    <>
      <Heading ref={ref} spacing aria-live="polite" level="1" role="alert" size="large" tabIndex={-1}>
        Søknaden din er sendt til bedriften
      </Heading>
      <BodyLong spacing>
        Du vil straks få en bekreftelse på e-posten din
        {' '}
        {email}
        . Ønsker du å trekke søknaden din finner du
        informasjon om dette i e-posten.
      </BodyLong>
      <Heading spacing level="2" size="medium">
        Hva skjer nå?
      </Heading>
      <BodyLong className="mb-8">
        Bedriften vil vurdere søknaden din og ta kontakt dersom de syns du passer for jobben. Du får beskjed på
        e-post så fort bedriften har gjort en vurdering.
      </BodyLong>
      <Button as={Link} href="/" variant="secondary">
        Tilbake til stillingssøket
      </Button>

      <GiveFeedback />
    </>
  );
};

Success.propTypes = {
  email: PropTypes.string,
};

export default Success;
