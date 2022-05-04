import PropTypes from "prop-types";
import React from "react";
import { Hovedknapp, Knapp } from "@navikt/arbeidsplassen-knapper";
import CustomModal from "./CustomModal";
import "./ErrorWithReloadPageModal.less";

export default function ErrorWithReloadPageModal({ title, children, onClose }) {
    function handleReloadPageClick() {
        window.location.reload();
    }

    return (
        <CustomModal
            role="alertdialog"
            onCloseClick={onClose}
            title={title}
            appElement={document.getElementById("app")}
        >
            <div className="ErrorWithReloadPageModal">
                <div className="ErrorWithReloadPageModal__message">{children}</div>
                <div className="ErrorWithReloadPageModal__buttons">
                    <Hovedknapp onClick={handleReloadPageClick}>Last siden på nytt</Hovedknapp>
                    <Knapp onClick={onClose}>Lukk</Knapp>
                </div>
            </div>
        </CustomModal>
    );
}

ErrorWithReloadPageModal.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
    onClose: PropTypes.func.isRequired
};
