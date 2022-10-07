import React from "react";
import PropTypes from "prop-types";
import NavFrontendModal from "nav-frontend-modal";
import "./Modal.css";

function Modal({ title, children, onCloseClick, ...props }) {
    return (
        <NavFrontendModal
            className="Modal"
            isOpen
            onRequestClose={onCloseClick}
            appElement={document.getElementById("app")}
            {...props}
        >
            <h1 className="Modal__title">{title}</h1>
            {children}
        </NavFrontendModal>
    );
}

Modal.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    title: PropTypes.string.isRequired,
    onCloseClick: PropTypes.func.isRequired
};

export default Modal;
