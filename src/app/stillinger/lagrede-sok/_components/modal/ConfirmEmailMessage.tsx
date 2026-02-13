import React, { useEffect, useRef } from "react";
import { BodyLong, Button, Modal } from "@navikt/ds-react";

interface ConfirmEmailMessageProps {
    onClose: () => void;
}

function ConfirmEmailMessage({ onClose }: ConfirmEmailMessageProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (buttonRef.current) {
            buttonRef.current.focus();
        }
    }, []);

    return (
        <>
            <Modal.Body>
                <BodyLong role="status">
                    Du må bekrefte e-postadressen din. Klikk på lenken i e-posten du har mottatt.
                </BodyLong>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" ref={buttonRef} onClick={onClose}>
                    Lukk
                </Button>
            </Modal.Footer>
        </>
    );
}

export default ConfirmEmailMessage;
