import React from "react";
import PropTypes from "prop-types";
import { Hovedknapp } from "@navikt/arbeidsplassen-knapper";
import CustomModal from "../../../components/modals/CustomModal";

function SearchIsEmptyModal({ onClose }) {
    return (
        <CustomModal onCloseClick={onClose} title="Velg søkekriterier først">
            <p>Du må fylle inn søkeord eller kriterier for å kunne lagre.</p>
            <div>
                <Hovedknapp onClick={onClose}>Lukk</Hovedknapp>
            </div>
        </CustomModal>
    );
}

SearchIsEmptyModal.propTypes = {
    onClose: PropTypes.func.isRequired
};

export default SearchIsEmptyModal;
