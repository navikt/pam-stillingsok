import React from "react";
import PropTypes from "prop-types";
import { Heading, Modal } from "@navikt/ds-react";
import "./CustomModal.css";

function CustomModal({ title, children, onCloseClick }) {
    return (
        <Modal open onClose={onCloseClick}>
            <Modal.Header>
                <Heading level="1" size="medium" spacing>
                    {title}
                </Heading>
            </Modal.Header>
            {children}
        </Modal>
    );
}

CustomModal.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    title: PropTypes.string.isRequired,
    onCloseClick: PropTypes.func.isRequired,
};

export default CustomModal;
