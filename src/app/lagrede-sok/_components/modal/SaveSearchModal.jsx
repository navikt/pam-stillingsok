'use client';

import {
  BodyLong, HStack, Loader, Modal,
} from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';

import * as actions from '@/app/_common/actions';
import AlertModalWithPageReload from '@/app/_common/components/modals/AlertModalWithPageReload';
import useToggle from '@/app/_common/hooks/useToggle';
import { UserContext } from '@/app/_common/user/UserProvider';
import { isStringEmpty } from '@/app/_common/utils/utils';
import NotFoundMessage from '@/app/lagrede-sok/_components/modal/NotFoundMessage';

import ConfirmEmailMessage from './ConfirmEmailMessage';
import RegisterEmailForm from './RegisterEmailForm';
import SaveSearchForm from './SaveSearchForm';
import SuccessMessage from './SuccessMessage';

/**
 * This modal let user create a new or edit an existing saved search.
 * If user subscribes to email notifications, this modal will show
 * a second step and ask user to register email address.
 */
function SaveSearchModal({
  onClose, onSaveSearchSuccess, formData, defaultFormMode, savedSearchUuid,
}) {
  const { user } = useContext(UserContext);

  const [shouldShowSavedSearchForm, showSavedSearchForm, hideSavedSearchForm] = useToggle(true);
  const [shouldShowRegisterEmailForm, showRegisterEmailForm, hideRegisterEmailForm] = useToggle(false);
  const [shouldShowSuccessMessage, showSuccessMessage] = useToggle(false);
  const [shouldShowConfirmEmailMessage, showConfirmEmailMessage] = useToggle(false);
  const [existingSavedSearch, setExistingSavedSearch] = useState();
  const [showError, setShowError] = useState(false);
  const [showNotFoundError, setShowNotFoundError] = useState(false);

  /**
     * If editing an existing saved search, fetch this first.
     * Otherwise, just show the save search form right away
     */
  useEffect(() => {
    async function getSavedSearch(uuid) {
      return actions.getSavedSearchAction(uuid);
    }

    if (savedSearchUuid) {
      getSavedSearch(savedSearchUuid)
        .then((savedSearch) => {
          if (savedSearch.success) {
            setExistingSavedSearch(savedSearch.data);
          } else if (savedSearch.statusCode === 404) {
            setShowNotFoundError(true);
          } else {
            setShowError(true);
          }
        })
        .catch(() => {
          setShowError(true);
        });
    } else {
      showSavedSearchForm();
    }
  }, [savedSearchUuid]);

  function handleSavedSearchFormSuccess(response) {
    if (onSaveSearchSuccess) {
      onSaveSearchSuccess(response);
    }

    hideSavedSearchForm();

    if (response.notifyType === 'EMAIL' && isStringEmpty(user.email)) {
      showRegisterEmailForm();
    } else {
      showSuccessMessage();
    }
  }

  function handleRegisterEmailSuccess() {
    hideRegisterEmailForm();
    showConfirmEmailMessage();
  }

  if (showError) {
    return (
      <AlertModalWithPageReload id="lagrede-sok-error" title="En feil har skjedd" onClose={onClose}>
        <BodyLong>Vennligst forsøk å laste siden på nytt.</BodyLong>
      </AlertModalWithPageReload>
    );
  }

  return (
    <Modal open portal header={{ heading: 'Lagre søk' }} width="medium" onClose={onClose}>
      {showNotFoundError ? <NotFoundMessage /> : null}

      {savedSearchUuid && !existingSavedSearch ? (
        <HStack justify="center">
          <Loader size="xlarge" />
        </HStack>
      ) : null}

      {shouldShowSavedSearchForm ? (
        <SaveSearchForm
          defaultFormMode={defaultFormMode}
          existingSavedSearch={existingSavedSearch}
          formData={formData}
          onClose={onClose}
          onSuccess={handleSavedSearchFormSuccess}
        />
      ) : null}

      {shouldShowRegisterEmailForm ? <RegisterEmailForm onClose={onClose} onSuccess={handleRegisterEmailSuccess} /> : null}

      {shouldShowSuccessMessage ? <SuccessMessage onClose={onClose} /> : null}

      {shouldShowConfirmEmailMessage ? <ConfirmEmailMessage onClose={onClose} /> : null}
    </Modal>
  );
}

SaveSearchModal.propTypes = {
  onClose: PropTypes.func,
  onSaveSearchSuccess: PropTypes.func,
  formData: PropTypes.shape({}),
  defaultFormMode: PropTypes.string,
  savedSearchUuid: PropTypes.string,
};

export default SaveSearchModal;
