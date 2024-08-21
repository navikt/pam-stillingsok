import React, { MutableRefObject, useEffect, useRef } from "react";
import { BodyLong, Button, Modal } from "@navikt/ds-react";

interface SuccessMessageProps {
    onClose: () => void;
}

function SuccessMessage({ onClose }: SuccessMessageProps) {
    const buttonRef: MutableRefObject<HTMLButtonElement | null> = useRef(null);

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

export default SuccessMessage;
