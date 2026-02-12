import React, { RefObject, useEffect, useRef, useState } from "react";
import { BodyLong, Button, Modal } from "@navikt/ds-react";

interface SuccessMessageProps {
    onClose: () => void;
}

function SuccessMessage({ onClose }: SuccessMessageProps) {
    const buttonRef: RefObject<HTMLButtonElement | null> = useRef(null);
    const [announce, setAnnounce] = useState("");

    useEffect(() => {
        buttonRef.current?.focus();

        // Sett teksten dynamisk etter kort delay, slik at skjermleser leser den
        const timer = setTimeout(() => setAnnounce("Søket ble lagret!"), 50);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Modal.Body>
                <BodyLong role="status" aria-atomic="true">
                    {announce}
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

export default SuccessMessage;
