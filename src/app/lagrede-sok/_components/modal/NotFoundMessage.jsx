import { Link as AkselLink, Alert, Modal } from '@navikt/ds-react';
import Link from 'next/link';
import React from 'react';

const NotFoundMessage = () => (
  <Modal.Body>
    <Alert role="alert" variant="warning">
      Det kan se ut som om du forsøker å oppdatere et lagret søk som ikke finnes lengre.
      {' '}
      <AkselLink as={Link} href="/">
        Last siden på nytt uten det gamle søket.
      </AkselLink>
    </Alert>
  </Modal.Body>
);

export default NotFoundMessage;
