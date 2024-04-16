import { BodyLong, Button, Modal } from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';

export default function AlertModal({
  id,
  title,
  children,
  confirmLabel = 'Fortsett',
  cancelLabel = 'Avbryt',
  onConfirm,
  onCancel,
  spinner = false,
  useOnlyCancelButton = false,
  showButtons = true,
  width = 'medium',
}) {
  const cancelButtonRef = useRef();

  return (
    <Modal
      open
      aria-describedby={`${id}-message`}
      header={{ heading: title }}
      role="alertdialog"
      width={width}
      onClose={onCancel}
    >
      <Modal.Body>
        <BodyLong id={`${id}-message`}>{children}</BodyLong>
      </Modal.Body>
      {showButtons ? (
        <Modal.Footer>
          {!useOnlyCancelButton && (
          <Button loading={spinner} variant="primary" onClick={onConfirm}>
            {confirmLabel}
          </Button>
          )}
          <Button
            ref={cancelButtonRef}
            disabled={spinner}
            variant={useOnlyCancelButton ? 'primary' : 'secondary'}
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
        </Modal.Footer>
      ) : null}
    </Modal>
  );
}

AlertModal.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
  spinner: PropTypes.bool,
  useOnlyCancelButton: PropTypes.bool,
  showButtons: PropTypes.bool,
  width: PropTypes.string,
};
