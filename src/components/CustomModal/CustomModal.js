import React from "react";
import PropTypes from "prop-types";
import "./CustomModal.css";
import { Modal } from "@navikt/ds-react";

function CustomModal({ title, children, onCloseClick, ...props }) {
    return (
        <Modal appElement={document.getElementById("app")} className="Modal" open onClose={onCloseClick} {...props}>
            <Modal.Content className="Modal__content">
                <h1 className="Modal__title">{title}</h1>
                {children}
            </Modal.Content>
        </Modal>
    );
}

CustomModal.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    title: PropTypes.string.isRequired,
    onCloseClick: PropTypes.func.isRequired
};

export default CustomModal;
