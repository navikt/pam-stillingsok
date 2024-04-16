import PropTypes from 'prop-types';
import React from 'react';

import AlertModal from './AlertModal';

export default function AlertModalWithPageReload({
  id, title, children, onClose,
}) {
  function handleReloadPageClick() {
    window.location.reload();
  }

  return (
    <AlertModal
      confirmLabel="Last siden på nytt"
      id={id}
      title={title}
      onCancel={onClose}
      onConfirm={handleReloadPageClick}
    >
      {children}
    </AlertModal>
  );
}

AlertModalWithPageReload.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
  onClose: PropTypes.func.isRequired,
};
