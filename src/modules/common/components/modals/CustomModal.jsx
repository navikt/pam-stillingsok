import React from "react";
import PropTypes from "prop-types";
import { Heading, Modal } from "@navikt/ds-react";
import "./CustomModal.css";

function CustomModal({ title, children, onCloseClick }) {
    return (
        <Modal className="CustomModal" open onClose={onCloseClick}>
            <Heading level="1" size="medium" spacing>
                {title}
            </Heading>
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
