import PropTypes from "prop-types";
import React from "react";
import { Flatknapp, Hovedknapp } from "@navikt/arbeidsplassen-knapper";
import "./ConfirmationModal.less";
import CustomModal from "./CustomModal";
import Alert from "../alert/Alert";

export default function ConfirmationModal({
    title,
    children,
    confirmLabel,
    cancelLabel,
    onConfirm,
    onCancel,
    spinner,
    errorMessage
}) {
    return (
        <CustomModal
            role="alertdialog"
            onCloseClick={onCancel}
            title={title}
            appElement={document.getElementById("app")}
        >
            <div className="ConfirmationModal">
                <div className="ConfirmationModal__message">
                    {children}
                    {errorMessage && <Alert>{errorMessage}</Alert>}
                </div>
                <div className="ConfirmationModal__buttons">
                    <Hovedknapp spinner={spinner} disabled={spinner} onClick={onConfirm}>
                        {confirmLabel}
                    </Hovedknapp>
                    <Flatknapp disabled={spinner} onClick={onCancel}>
                        {cancelLabel}
                    </Flatknapp>
                </div>
            </div>
        </CustomModal>
    );
}

ConfirmationModal.defaultProps = {
    confirmLabel: "Forsett",
    cancelLabel: "Avbryt",
    spinner: false
};

ConfirmationModal.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
    confirmLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    spinner: PropTypes.bool
};
