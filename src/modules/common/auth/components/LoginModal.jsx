import React from "react";
import PropTypes from "prop-types";
import { Modal } from "@navikt/ds-react";
import RequiresAuthentication from "./RequiresAuthentication";

function LoginModal({ onLoginClick, onCloseClick }) {
    return (
        <Modal width="small" role="alertdialog" open aria-label="Du må logge inn først" onClose={onCloseClick}>
            <RequiresAuthentication onLogin={onLoginClick} onCancel={onCloseClick} />
        </Modal>
    );
}

LoginModal.propTypes = {
    onCloseClick: PropTypes.func.isRequired,
    onLoginClick: PropTypes.func.isRequired,
};

export default LoginModal;
