import React, {useEffect} from "react";
import PropTypes from "prop-types";
import RequiresAuthentication from "./RequiresAuthentication";
import { Modal } from "@navikt/ds-react";

function LoginModal({onLoginClick, onCloseClick }) {
    useEffect(() => {
        Modal.setAppElement("#app");
    }, []);

    return (
        <Modal 
            role="alertdialog"
            open={true} 
            id="login-modal"
            onClose={onCloseClick}>
            <RequiresAuthentication onLogin={onLoginClick} onCancel={onCloseClick}></RequiresAuthentication>
        </Modal>
    );
}

LoginModal.propTypes = {
    onCloseClick: PropTypes.func.isRequired,
    onLoginClick: PropTypes.func.isRequired
};

export default LoginModal;
