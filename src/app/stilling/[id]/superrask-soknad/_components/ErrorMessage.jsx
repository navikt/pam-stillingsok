import React from "react";
import PropTypes from "prop-types";
import { Alert, Heading } from "@navikt/ds-react";

const getErrorMessage = (errorCode) => {
    switch (errorCode) {
        case "invalid_name":
            return "Sjekk at navnet ditt er skrevet riktig og prøv igjen.";
        case "invalid_email":
            return "Sjekk at e-posten din er skrevet riktig og prøv igjen. Eksempel: epost@mail.no";
        case "invalid_telephone":
            return "Sjekk at telefonnummeret ditt er skrevet riktig og prøv igjen. Eksempel: +47 99 99 99 99";
        case "invalid_motivation":
            return "Sjekk at begrunnelsen din ikke inneholder noen lenker eller er lenger enn 800 tegn.";
        case "offline":
            return "Sjekk nettforbindelsen din og prøv igjen.";
        default:
            return "Det oppsto dessverre en feil. Prøv å sende inn søknaden igjen.";
    }
};

function ErrorMessage({ errorCode }) {
    return (
        <Alert variant="error" className="mb-4 mt-4" role="alert">
            <Heading level="2" size="xsmall" spacing>
                Søknaden ble ikke sendt
            </Heading>
            {getErrorMessage(errorCode)}
        </Alert>
    );
}

ErrorMessage.propTypes = {
    errorCode: PropTypes.string,
};

export default ErrorMessage;
