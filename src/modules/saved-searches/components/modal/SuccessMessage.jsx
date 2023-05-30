import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CONTEXT_PATH } from "../../../../common/environment";
import { BodyLong, Button, Link as AkselLink } from "@navikt/ds-react";

function SuccessMessage({ onClose }) {
    let buttonRef = useRef(null);

    useEffect(() => {
        if (buttonRef.current) {
            buttonRef.current.focus();
        }
    }, []);

    return (
        <section role="status">
            <BodyLong>Søket ble lagret!</BodyLong>
            <div className="SaveSearchForm__buttons">
                <Button variant="primary" ref={buttonRef} onClick={onClose}>
                    Lukk
                </Button>
            </div>
        </section>
    );
}

export default SuccessMessage;
