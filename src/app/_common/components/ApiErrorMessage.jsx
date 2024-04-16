import { Alert, Heading } from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';

const getErrorMessage = (apiErrorCode) => {
  switch (apiErrorCode) {
    case 'invalid_name':
      return 'Sjekk at navnet ditt er skrevet riktig og prøv igjen.';
    case 'invalid_email':
      return 'Sjekk at e-posten din er skrevet riktig og prøv igjen. Eksempel: epost@mail.no';
    case 'invalid_telephone':
      return 'Sjekk at telefonnummeret ditt er skrevet riktig og prøv igjen. Eksempel: +47 99 99 99 99';
    case 'invalid_motivation':
      return 'Sjekk at begrunnelsen din ikke inneholder noen lenker eller er lenger enn 800 tegn.';
    case 'offline':
      return 'Sjekk nettforbindelsen din og prøv igjen.';
    default:
      return 'Det oppsto dessverre en feil. Prøv å sende inn søknaden igjen.';
  }
};

const ApiErrorMessage = ({ apiErrorCode, errorHeading = 'Søknaden ble ikke sendt' }) => (
  <Alert className="mb-4 mt-4" role="alert" variant="error">
    <Heading spacing level="2" size="xsmall">
      {errorHeading}
    </Heading>
    {getErrorMessage(apiErrorCode)}
  </Alert>
);

ApiErrorMessage.propTypes = {
  apiErrorCode: PropTypes.string,
};

export default ApiErrorMessage;
