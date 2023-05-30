import React, { useEffect, useRef } from "react";
import { BodyLong, Button } from "@navikt/ds-react";

function ConfirmEmailMessage({ onClose }) {
    const buttonRef = useRef(null);

    useEffect(() => {
        if (buttonRef.current) {
            buttonRef.current.focus();
        }
    }, []);

    return (
        <section role="status">
            <BodyLong>Du må bekrefte e-postadressen din. Klikk på lenken i e-posten du har mottatt.</BodyLong>

            <div className="SaveSearchForm__buttons">
                <Button variant="primary" ref={buttonRef} onClick={onClose}>
                    Lukk
                </Button>
            </div>
        </section>
    );
}

ConfirmEmailMessage.propTypes = {};

export default ConfirmEmailMessage;
