'use client';

import {
  Link as AkselLink,
  Alert,
  BodyLong,
  Button,
  Checkbox,
  Modal,
  Radio,
  RadioGroup,
  TextField,
} from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React, {
  useContext, useRef, useState, useTransition,
} from 'react';

import * as actions from '@/app/_common/actions';
import useToggle from '@/app/_common/hooks/useToggle';
import { UserContext } from '@/app/_common/user/UserProvider';
import { isStringEmpty } from '@/app/_common/utils/utils';

export const FormModes = {
  ADD: 'ADD',
  UPDATE: 'UPDATE',
  UPDATE_QUERY_ONLY: 'UPDATE_QUERY_ONLY',
};

/**
 * Form for creating or updating a saved search.
 */
const SaveSearchForm = ({
  existingSavedSearch, onClose, onSuccess, formData, defaultFormMode,
}) => {
  const [isPending, startTransition] = useTransition();
  const [showError, setShowError] = useState(false);

  const { user } = useContext(UserContext);

  // Form modes
  const [formMode, setFormMode] = useState(defaultFormMode);
  const [shouldShowForm, showForm, hideForm] = useToggle(defaultFormMode !== FormModes.UPDATE_QUERY_ONLY);

  // Form data
  const [title, setTitle] = useState(formData.title);
  const [notifyType, setNotifyType] = useState(formData.notifyType ? formData.notifyType : 'NONE');
  const [duration, setDuration] = useState(formData.duration ? formData.duration : 30);

  // Validation
  const [titleValidationError, setTitleValidationError] = useState(undefined);

  const titleRef = useRef();

  function validateForm() {
    let isValid = true;

    if (title.trim().length === 0) {
      isValid = false;
      setTitleValidationError('Tittel mangler');
      if (titleRef.current) {
        titleRef.current.focus();
      }
    } else {
      setTitleValidationError(undefined);
    }

    return isValid;
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (validateForm()) {
      let dataToBeSaved = {
        title,
        notifyType,
        duration: notifyType === 'NONE' ? 0 : duration,
        status: notifyType === 'NONE' ? 'INACTIVE' : 'ACTIVE',
        searchQuery: formData.searchQuery,
      };

      if (formMode === FormModes.ADD) {
        startTransition(async () => {
          setShowError(false);
          let isSuccess;
          let result;
          try {
            result = await actions.saveSavedSearchAction(dataToBeSaved);
            isSuccess = result.success;
          } catch (err) {
            isSuccess = false;
          }
          if (isSuccess) {
            onSuccess(result.data);
          } else {
            setShowError(true);
          }
        });
      } else {
        if (formMode === FormModes.UPDATE) {
          dataToBeSaved = {
            ...existingSavedSearch,
            ...dataToBeSaved,
          };
        } else if (formMode === FormModes.UPDATE_QUERY_ONLY) {
          dataToBeSaved = {
            ...existingSavedSearch,
            searchQuery: formData.searchQuery,
          };
        }
        startTransition(async () => {
          setShowError(false);
          let isSuccess;
          let result;
          try {
            result = await actions.updateSavedSearchAction(dataToBeSaved);
            isSuccess = result.success;
          } catch (err) {
            isSuccess = false;
          }
          if (isSuccess) {
            onSuccess(result.data);
          } else {
            setShowError(true);
          }
        });
      }
    }
  }

  function handleFormModeChange(value) {
    if (value === FormModes.ADD) {
      showForm();
    } else {
      hideForm();
    }
    setFormMode(value);
  }

  function handleTitleChange(e) {
    setTitle(e.target.value);
    setTitleValidationError(false);
  }

  function handleSubscribeChange(e) {
    if (e.target.checked) {
      setNotifyType('EMAIL');
    } else {
      setNotifyType('NONE');
    }
  }

  function handleDurationChange(value) {
    setDuration(value, 10);
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <Modal.Body>
        {defaultFormMode === FormModes.UPDATE_QUERY_ONLY && existingSavedSearch ? (
          <RadioGroup
            legend={`Ønsker du å lagre endringene for ${existingSavedSearch.title} eller lagre et nytt søk?`}
            name="add_or_replace"
            value={formMode}
            onChange={handleFormModeChange}
          >
            <Radio value={FormModes.UPDATE_QUERY_ONLY}>Lagre endringene</Radio>
            <Radio value={FormModes.ADD}>Lagre nytt søk</Radio>
          </RadioGroup>
        ) : null}

        {shouldShowForm ? (
          <>
            <TextField
              ref={titleRef}
              className="mb-6"
              error={titleValidationError}
              id="SavedSearchModal__name"
              label="Navn*"
              value={title}
              onChange={handleTitleChange}
            />
            <Checkbox checked={notifyType === 'EMAIL'} className="mb-6" onChange={handleSubscribeChange}>
              Ja, jeg ønsker å motta e-post med varsel om nye treff
            </Checkbox>
            {notifyType === 'EMAIL' && (
              <>
                <RadioGroup
                  legend="Varighet på varsel"
                  name="duration"
                  value={duration}
                  onChange={handleDurationChange}
                >
                  <Radio value={30}>30 dager</Radio>
                  <Radio value={60}>60 dager</Radio>
                  <Radio value={90}>90 dager</Radio>
                </RadioGroup>
                {!isStringEmpty(user.email) && (
                <BodyLong>
                  Varsel sendes på e-post. Gå til
                  {' '}
                  <AkselLink href="/min-side/innstillinger">samtykker og innstillinger</AkselLink>
                  {' '}
                  for å endre e-postadresse.
                </BodyLong>
                )}
              </>
            )}
          </>
        ) : null}
        {showError ? (
          <Alert className="mb-4 mt-4" role="alert" variant="error">
            Noe gikk galt ved lagring, forsøk igjen eller last siden på nytt
          </Alert>
        ) : null}
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={isPending} loading={isPending} type="submit" variant="primary">
          Lagre søk
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          Avbryt
        </Button>
      </Modal.Footer>
    </form>
  );
};

SaveSearchForm.propTypes = {
  existingSavedSearch: PropTypes.shape({
    uuid: PropTypes.string,
    title: PropTypes.string,
  }),
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
  formData: PropTypes.shape({
    searchQuery: PropTypes.string,
    duration: PropTypes.number,
    notifyType: PropTypes.string,
    title: PropTypes.string,
  }),
  defaultFormMode: PropTypes.string,
};

export default SaveSearchForm;
