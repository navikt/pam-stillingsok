import React from "react";
import PropTypes from "prop-types";
import AlertModal from "../../../common/components/modals/AlertModal";
import RequiresAuthentication from "./RequiresAuthentication";

function LoginModal({ onLoginClick, onCloseClick }) {
    return (
        <AlertModal onCancel={onCloseClick}>
            <RequiresAuthentication onCancel={onCloseClick}></RequiresAuthentication>
            {/* Logg inn med MinID, BankID, BankID på mobil, Buypass eller Commfides. */}
        </AlertModal>
    );
}

LoginModal.propTypes = {
    onLoginClick: PropTypes.func.isRequired,
    onCloseClick: PropTypes.func.isRequired
};

export default LoginModal;
