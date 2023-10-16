import React from "react";
import PropTypes from "prop-types";
import { Heading, Modal } from "@navikt/ds-react";

function CustomModal({ title, children, onCloseClick, width = "medium" }) {
    return (
        <Modal open onClose={onCloseClick} width={width}>
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
    width: PropTypes.string,
};

export default CustomModal;
