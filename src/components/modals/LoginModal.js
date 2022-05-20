import React from "react";
import PropTypes from "prop-types";
import AlertModal from "./AlertModal";

function LoginModal({ onLoginClick, onCloseClick }) {
    return (
        <AlertModal onCancel={onCloseClick} onConfirm={onLoginClick} confirmLabel="Logg inn" title="Du må logge inn">
            Logg inn med MinID, BankID, BankID på mobil, Buypass eller Commfides.
        </AlertModal>
    );
}

LoginModal.propTypes = {
    onLoginClick: PropTypes.func.isRequired,
    onCloseClick: PropTypes.func.isRequired
};

export default LoginModal;
