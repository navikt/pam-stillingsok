import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { BodyLong, Button } from "@navikt/ds-react";

function SuccessMessage({ onClose }) {
    const buttonRef = useRef(null);

    useEffect(() => {
        if (buttonRef.current) {
            buttonRef.current.focus();
        }
    }, []);

    return (
        <>
            <BodyLong>Søket ble lagret!</BodyLong>
            <div className="SaveSearchForm__buttons">
                <Button variant="primary" ref={buttonRef} onClick={onClose}>
                    Lukk
                </Button>
            </div>
        </>
    );
}

SuccessMessage.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default SuccessMessage;
