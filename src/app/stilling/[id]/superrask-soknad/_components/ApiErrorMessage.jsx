import React from "react";
import PropTypes from "prop-types";
import { Alert } from "@navikt/ds-react";

const getErrorMessage = (apiErrorCode) => {
    switch (apiErrorCode) {
        case "invalid_name":
            return "Vi kunne ikke sende inn søknaden din. Sjekk at navnet ditt er skrevet riktig og prøv på nytt.";
        case "invalid_email":
            return "Vi kunne ikke sende inn søknaden din. Sjekk at e-posten din er skrevet riktig og prøv på nytt. Eksempel: epost@mail.no";
        case "invalid_telephone":
            return "Vi kunne ikke sende inn søknaden din. Sjekk at telefonnummeret ditt er skrevet riktig og prøv på nytt. Eksempel: +47 99 99 99 99";
        case "invalid_motivation":
            return "Vi kunne ikke sende inn søknaden din. Sjekk at begrunnelsen din ikke inneholder noen lenker eller er lenger enn 800 tegn.";
        case "offline":
            return "Vi kunne ikke sende inn søknaden din. Sjekk forbindelsen din til internett.";
        default:
            return "Det oppsto dessverre en feil og vi kunne ikke sende inn søknaden din. Prøv å send søknaden på nytt.";
    }
};

function ApiErrorMessage({ apiErrorCode }) {
    return (
        <Alert variant="error" className="mb-4 mt-4" role="alert">
            {getErrorMessage(apiErrorCode)}
        </Alert>
    );
}

ApiErrorMessage.propTypes = {
    apiErrorCode: PropTypes.string,
};

export default ApiErrorMessage;
