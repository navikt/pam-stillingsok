import {
  Alert, BodyLong, Button, ConfirmationPanel, Modal,
} from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';

import * as actions from '@/app/_common/actions';
import { AuthenticationContext } from '@/app/_common/auth/contexts/AuthenticationProvider';
import { FetchStatus } from '@/app/_common/hooks/useFetchReducer';
import useToggle from '@/app/_common/hooks/useToggle';

import { UserContext } from './UserProvider';

const UserConsentModal = ({ onClose, onTermsAccepted }) => {
  const { userNameAndInfo } = useContext(AuthenticationContext);
  const { updateUser } = useContext(UserContext);
  const [shouldShowError, showError, hideError] = useToggle();
  const [checked, check, uncheck] = useToggle();
  const [fetchStatus, setFetchStatus] = useState(FetchStatus.NOT_FETCHED);

  async function createUser() {
    setFetchStatus(FetchStatus.IS_FETCHING);

    let isSuccess;
    let result;
    try {
      result = await actions.createUser({ acceptedTerms: 'sok_v1' });
      isSuccess = result.success;
    } catch (err) {
      isSuccess = false;
    }

    if (isSuccess) {
      setFetchStatus(FetchStatus.SUCCESS);

      if (onTermsAccepted) {
        onTermsAccepted();
      }

      updateUser(result.data);
    } else {
      setFetchStatus(FetchStatus.FAILURE);
    }
  }

  function onCheckboxClick(e) {
    hideError();
    if (e.target.checked) {
      check();
    } else {
      uncheck();
    }
  }

  async function onAcceptTermsClick() {
    if (checked) {
      await createUser();
    } else {
      showError();
    }
  }

  const title = userNameAndInfo && userNameAndInfo.erUnderFemten
    ? 'Du må nok vente litt til'
    : 'Ta i bruk innloggede tjenester';

  return (
    <Modal open header={{ heading: title }} width="medium" onClose={onClose}>
      {userNameAndInfo && userNameAndInfo.erUnderFemten ? (
        <>
          <Modal.Body>
            <BodyLong>
              Du er under 15 år og er dessverre ikke gammel nok til å ha en profil på arbeidsplassen.no.
              Kom gjerne tilbake igjen ved en senere anledning.
            </BodyLong>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={onClose}>
              Lukk
            </Button>
          </Modal.Footer>
        </>
      ) : (
        <>
          <Modal.Body>
            <BodyLong spacing>Du må samtykke for å bruke innloggede tjenester i stillingssøk.</BodyLong>
            <ConfirmationPanel
              checked={checked}
              className="mb-8"
              error={shouldShowError ? 'Du må huke av i avkryssingsboksen for å samtykke' : undefined}
              label="Dine favoritter, søk og søkekriterier"
              onChange={onCheckboxClick}
            >
              Vi lagrer dine favoritter, søk med søkekriterier og e-postadresse (valgfri). Det er kun du
              som kan se hva du har lagret.
            </ConfirmationPanel>
            <BodyLong>
              Du kan trekke samtykket hvis du ikke lenger ønsker å bruke de innloggede tjenestene. Dette
              kan du gjøre under innstillinger.
            </BodyLong>
            {fetchStatus === FetchStatus.FAILURE && (
            <Alert className="mb-4 mt-4" role="alert" variant="error">
              Det oppsto en feil ved lagring av samtykke. Forsøk igjen.
            </Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              id="TermsOfUse__acceptButton"
              loading={fetchStatus === FetchStatus.IS_FETCHING}
              variant="primary"
              onClick={onAcceptTermsClick}
            >
              Jeg samtykker
            </Button>
            <Button variant="tertiary" onClick={onClose}>
              Avbryt
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
};

UserConsentModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onTermsAccepted: PropTypes.func,
};

export default UserConsentModal;
