import PropTypes from 'prop-types';
import React from 'react';

import AlertModal from '@/app/_common/components/modals/AlertModal';

const SearchIsEmptyModal = ({ onClose }) => (
  <AlertModal
    useOnlyCancelButton
    cancelLabel="Lukk"
    id="search-is-empty-modal"
    title="Velg søkekriterier først"
    onCancel={onClose}
  >
    Du må fylle inn søkeord eller kriterier for å kunne lagre.
  </AlertModal>
);

SearchIsEmptyModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default SearchIsEmptyModal;
