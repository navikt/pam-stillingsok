import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
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
            <BodyLong className="mb-8">
                Du må bekrefte e-postadressen din. Klikk på lenken i e-posten du har mottatt.
            </BodyLong>

            <Button variant="primary" ref={buttonRef} onClick={onClose}>
                Lukk
            </Button>
        </section>
    );
}

ConfirmEmailMessage.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default ConfirmEmailMessage;
