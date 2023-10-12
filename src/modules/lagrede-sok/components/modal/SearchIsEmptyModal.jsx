import React from "react";
import PropTypes from "prop-types";
import AlertModal from "../../../common/components/modals/AlertModal";

function SearchIsEmptyModal({ onClose }) {
    return (
        <AlertModal
            id="search-is-empty-modal"
            onCancel={onClose}
            title="Velg søkekriterier først"
            cancelLabel="Lukk"
            useOnlyCancelButton
        >
            Du må fylle inn søkeord eller kriterier for å kunne lagre.
        </AlertModal>
    );
}

SearchIsEmptyModal.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default SearchIsEmptyModal;
