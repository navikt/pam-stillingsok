import React from "react";
import PropTypes from "prop-types";
import AlertModal from "../../components/AlertModal/AlertModal";

function AuthenticationModal({ onLoginClick, onCloseClick }) {
    return (
        <AlertModal onCancel={onCloseClick} onConfirm={onLoginClick} confirmLabel="Logg inn" title="Du må logge inn">
            Logg inn med MinID, BankID, BankID på mobil, Buypass eller Commfides.
        </AlertModal>
    );
}

AuthenticationModal.propTypes = {
    onLoginClick: PropTypes.func.isRequired,
    onCloseClick: PropTypes.func.isRequired
};

export default AuthenticationModal;
