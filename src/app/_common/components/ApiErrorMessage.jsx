import React from "react";
import PropTypes from "prop-types";
import { Alert, Heading } from "@navikt/ds-react";

const getErrorMessage = (apiErrorCode) => {
    switch (apiErrorCode) {
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
        case "forbidden":
            return "Du har nådd grensen for antall søknader som kan sendes på 10 minutter. Ta en kort pause og prøv igjen om noen minutter.";
        case "conflict":
            return "Du har allerede sendt en identisk søknad til denne arbeidsgiveren. Oppdater søknaden med ny informasjon før du sender den på nytt.";
        default:
            return "Det oppsto dessverre en feil. Prøv å sende inn søknaden igjen.";
    }
};

function ApiErrorMessage({ apiErrorCode, errorHeading = "Søknaden ble ikke sendt" }) {
    return (
        <Alert variant="error" className="mb-4 mt-4" role="alert">
            <Heading level="2" size="xsmall" spacing>
                {errorHeading}
            </Heading>
            {getErrorMessage(apiErrorCode)}
        </Alert>
    );
}

ApiErrorMessage.propTypes = {
    apiErrorCode: PropTypes.string,
};

export default ApiErrorMessage;
