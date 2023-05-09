import React from "react";
import PropTypes from "prop-types";
import AlertModal from "../../../common/components/modals/AlertModal";
import RequiresAuthentication from "./RequiresAuthentication";

function LoginModal({onLoginClick, onCloseClick }) {
    return (
        <AlertModal id="login-modal" onCancel={onCloseClick} showButtons={false}>
            <RequiresAuthentication onLogin={onLoginClick} onCancel={onCloseClick}></RequiresAuthentication>
            {/* Logg inn med MinID, BankID, BankID på mobil, Buypass eller Commfides. */}
        </AlertModal>
    );
}

LoginModal.propTypes = {
    onCloseClick: PropTypes.func.isRequired,
    onLoginClick: PropTypes.func.isRequired
};

export default LoginModal;
