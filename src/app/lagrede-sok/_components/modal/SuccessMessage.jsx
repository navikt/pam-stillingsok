import { BodyLong, Button, Modal } from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';

const SuccessMessage = ({ onClose }) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.focus();
    }
  }, []);

  return (
    <>
      <Modal.Body>
        <BodyLong role="status">Søket ble lagret!</BodyLong>
      </Modal.Body>
      <Modal.Footer>
        <Button ref={buttonRef} variant="primary" onClick={onClose}>
          Lukk
        </Button>
      </Modal.Footer>
    </>
  );
};

SuccessMessage.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default SuccessMessage;
