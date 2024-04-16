import {
  Alert, BodyLong, Button, Modal, TextField,
} from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';

import * as actions from '@/app/_common/actions';
import { FetchStatus } from '@/app/_common/hooks/useFetchReducer';
import { UserContext } from '@/app/_common/user/UserProvider';
import { isValidEmail } from '@/app/_common/utils/utils';

const RegisterEmailForm = ({ onClose, onSuccess }) => {
  const { user, updateUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [saveStatus, setSaveStatus] = useState(FetchStatus.NOT_FETCHED);
  const [emailValidationError, setEmailValidationError] = useState(undefined);
  const emailRef = useRef();

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  function validateForm() {
    let isValid = true;

    if (email && email.length > 0 && !isValidEmail(email)) {
      isValid = false;
      setEmailValidationError(
        'E-postadressen er ugyldig. Den må minimum inneholde en «@» og et punktum. Den kan ikke inneholde noen mellomrom. For eksempel: navn.navnesen@gmail.com',
      );
    } else if (email === undefined || email === null || email.trim().length === 0) {
      isValid = false;
      setEmailValidationError('Du må skrive inn e-postadresse for å kunne få varsler på e-post');
    } else {
      setEmailValidationError(undefined);
    }
    if (!isValid) {
      emailRef.current.focus();
    }
    return isValid;
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    if (validateForm()) {
      setSaveStatus(FetchStatus.IS_FETCHING);
      let isSuccess;
      let result;

      try {
        result = await actions.updateUser({ ...user, email });
        isSuccess = result.success;
      } catch (err) {
        isSuccess = false;
      }

      if (isSuccess) {
        setSaveStatus(FetchStatus.SUCCESS);
        updateUser(result.data);
        onSuccess();
      } else {
        setSaveStatus(FetchStatus.FAILURE);
      }
    }
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
    setEmailValidationError(undefined);
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <Modal.Body>
        <div role="status">
          <BodyLong weight="semibold">
            Søket ditt er lagret, men du har ikke registrert e-postadresse.
          </BodyLong>
          <BodyLong spacing>For å motta varsler på e-post må du registrere e-postadressen din.</BodyLong>
        </div>
        <TextField
          ref={emailRef}
          error={emailValidationError}
          label="Skriv inn e-postadressen din"
          type="email"
          value={email || ''}
          onChange={handleEmailChange}
        />

        {saveStatus === FetchStatus.FAILURE && (
        <Alert className="mb-4 mt-4" role="alert" variant="error">
          Noe gikk galt ved lagring, forsøk igjen eller last siden på nytt
        </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          disabled={saveStatus === FetchStatus.IS_FETCHING}
          loading={saveStatus === FetchStatus.IS_FETCHING}
          type="submit"
          variant="primary"
        >
          Lagre e-post
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          Avbryt
        </Button>
      </Modal.Footer>
    </form>
  );
};

RegisterEmailForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default RegisterEmailForm;
