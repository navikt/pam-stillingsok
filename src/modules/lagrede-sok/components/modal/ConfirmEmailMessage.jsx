import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { BodyLong, Button, Modal } from "@navikt/ds-react";

function ConfirmEmailMessage({ onClose }) {
    const buttonRef = useRef(null);

    useEffect(() => {
        if (buttonRef.current) {
            buttonRef.current.focus();
        }
    }, []);

    return (
        <>
            <Modal.Body>
                <BodyLong>Du må bekrefte e-postadressen din. Klikk på lenken i e-posten du har mottatt.</BodyLong>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" ref={buttonRef} onClick={onClose}>
                    Lukk
                </Button>
            </Modal.Footer>
        </>
    );
}

ConfirmEmailMessage.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default ConfirmEmailMessage;
