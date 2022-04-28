import React from "react";
import PropTypes from "prop-types";
import { Flatknapp, Hovedknapp } from "@navikt/arbeidsplassen-knapper";
import CustomModal from "./CustomModal";
import "./LoginModal.less";

function LoginModal({ onLoginClick, onCloseClick }) {
    return (
        <CustomModal role="alertdialog" onCloseClick={onCloseClick} title="Du må logge inn">
            <p className="LoginModal__message">Logg inn med MinID, BankID, BankID på mobil, Buypass eller Commfides.</p>
            <div className="LoginModal__buttons">
                <Hovedknapp onClick={onLoginClick}>Logg inn</Hovedknapp>
                <Flatknapp onClick={onCloseClick}>Avbryt</Flatknapp>
            </div>
        </CustomModal>
    );
}

LoginModal.propTypes = {
    onLoginClick: PropTypes.func.isRequired,
    onCloseClick: PropTypes.func.isRequired
};

export default LoginModal;
