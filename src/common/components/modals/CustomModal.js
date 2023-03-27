import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Modal } from "@navikt/ds-react";
import "./CustomModal.css";

function CustomModal({ title, children, onCloseClick }) {
    useEffect(() => {
        Modal.setAppElement("#app");
    }, []);

    return (
        <Modal className="CustomModal" open={true} onClose={onCloseClick}>
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
