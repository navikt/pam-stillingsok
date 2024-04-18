import { EnterIcon } from '@navikt/aksel-icons';
import { FigureWithKey } from '@navikt/arbeidsplassen-react';
import {
  BodyLong, Button, HStack, Modal, VStack,
} from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';

function LoginModal({ onLoginClick, onCloseClick }) {
  return <Modal
    open
    header={{ heading: 'Du må logge inn først' }}
    role="alertdialog"
    width="small"
    onClose={onCloseClick}
  >
    <Modal.Body>
      <VStack gap="6">
        <BodyLong>
          Du bruker BankID for å logge inn på
          {' '}
          <span translate="no">arbeidsplassen.no</span>
        </BodyLong>
        <HStack justify="center">
          <FigureWithKey />
        </HStack>
      </VStack>
    </Modal.Body>
    <Modal.Footer>
      {onLoginClick ? (
        <Button icon={<EnterIcon aria-hidden="true" />} variant="primary" onClick={onLoginClick}>
          Logg inn
        </Button>
      ) : (
        <Button icon={<EnterIcon aria-hidden="true" />} variant="primary" onClick={onLoginClick}>
          Logg inn
        </Button>
      )}

      {onCloseClick ? (
        <Button variant="secondary" onClick={onCloseClick}>
          Avbryt
        </Button>
      ) : null}
    </Modal.Footer>
  </Modal>
}

LoginModal.propTypes = {
  onCloseClick: PropTypes.func.isRequired,
  onLoginClick: PropTypes.func.isRequired,
};

export default LoginModal;
