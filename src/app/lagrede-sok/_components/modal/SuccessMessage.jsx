import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { BodyLong, Button, Modal } from "@navikt/ds-react";

function SuccessMessage({ onClose }) {
    const buttonRef = useRef(null);

    useEffect(() => {
        if (buttonRef.current) {
            buttonRef.current.focus();
        }
    }, []);

    return (
        <>
            <Modal.Body>
                <BodyLong role="status">Søket ble lagret!</BodyLong>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" ref={buttonRef} onClick={onClose}>
                    Lukk
                </Button>
            </Modal.Footer>
        </>
    );
}

SuccessMessage.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default SuccessMessage;
