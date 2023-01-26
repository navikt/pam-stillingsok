import React from "react";
import PropTypes from "prop-types";
import Modal from "nav-frontend-modal";
import "./CustomModal.css";

function CustomModal({ title, children, onCloseClick, ...props }) {
    return (
        <Modal
            className="CustomModal"
            isOpen
            onRequestClose={onCloseClick}
            appElement={document.getElementById("app")}
            {...props}
        >
            <h1 className="CustomModal__title">{title}</h1>
            {children}
        </Modal>
    );
}

CustomModal.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    title: PropTypes.string.isRequired,
    onCloseClick: PropTypes.func.isRequired
};

export default CustomModal;
