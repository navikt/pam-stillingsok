import React from "react";
import PropTypes from "prop-types";
import Modal from "nav-frontend-modal";
import "./CustomModal.less";

function CustomModal({ title, children, onCloseClick }) {
    return (
        <Modal
            className="CustomModal"
            isOpen
            onRequestClose={onCloseClick}
            contentLabel={title}
            appElement={document.getElementById("app")}
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
