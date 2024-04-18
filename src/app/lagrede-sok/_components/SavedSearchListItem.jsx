'use client';

import { ArrowsCirclepathIcon, PencilIcon, TrashIcon } from '@navikt/aksel-icons';
import {
  Link as AkselLink, Alert, BodyShort, Button, HStack, Heading, Tag,
} from '@navikt/ds-react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React, { useState, useTransition } from 'react';

import * as actions from '@/app/_common/actions';
import AlertModal from '@/app/_common/components/modals/AlertModal';
import { FetchStatus } from '@/app/_common/hooks/useFetchReducer';
import useToggle from '@/app/_common/hooks/useToggle';
import UserAPI from '@/app/_common/user/UserAPI';
import { formatDate } from '@/app/_common/utils/utils';

import { FormModes } from './modal/SaveSearchForm';
import SaveSearchModal from './modal/SaveSearchModal';

function SavedSearchListItem({
  savedSearch,
  removeSavedSearchFromList,
  replaceSavedSearchInList,
  autoOpenModal,
  openErrorDialog,
}) {
  const [isPending, startTransition] = useTransition();

  const [shouldShowSavedSearchModal, openSavedSearchModal, closeSavedSearchModal] = useToggle(autoOpenModal);
  const [shouldShowConfirmationModal, openConfirmationModal, closeConfirmationModal] = useToggle();
  const [restartEmailNotificationStatus, setRestartEmailNotificationStatus] = useState(FetchStatus.NOT_FETCHED);
  const isEmailNotificationExpired = savedSearch.status === 'INACTIVE' && savedSearch.notifyType === 'EMAIL';

  function deleteSavedSearch() {
    startTransition(async () => {
      let isSuccess;
      try {
        const { success } = await actions.deleteSavedSearchAction(savedSearch.uuid);
        isSuccess = success;
      } catch (err) {
        isSuccess = false;
      }
      closeConfirmationModal();
      if (isSuccess) {
        removeSavedSearchFromList(savedSearch);
      } else {
        openErrorDialog();
      }
    });
  }

  function reactivateEmailNotification() {
    setRestartEmailNotificationStatus(FetchStatus.IS_FETCHING);

    UserAPI.put(`api/v1/savedsearches/${savedSearch.uuid}`, {
      ...savedSearch,
      status: 'ACTIVE',
    })
      .then((response) => {
        setRestartEmailNotificationStatus(FetchStatus.SUCCESS);
        replaceSavedSearchInList(response);
      })
      .catch(() => {
        setRestartEmailNotificationStatus(FetchStatus.FAILURE);
      });
  }

  function handleSavedSearchUpdated(updatedData) {
    replaceSavedSearchInList(updatedData);
  }

  return (
    <article>
      <Heading spacing level="3" size="small">
        <AkselLink as={Link} href={`/${savedSearch.searchQuery}&saved=${savedSearch.uuid}`}>
          {savedSearch.title}
        </AkselLink>
      </Heading>

      {savedSearch.updated ? (
        <BodyShort spacing>
          Sist endret:
          {formatDate(savedSearch.updated)}
        </BodyShort>
      ) : null}

      {savedSearch.notifyType === 'EMAIL' ? (
        <>
          <BodyShort>
            Varighet på varsel:
            {savedSearch.duration}
            {' '}
            dager
          </BodyShort>
          {savedSearch.expires ? (
            <BodyShort>
              Utløper:
              {formatDate(savedSearch.expires)}
            </BodyShort>
          ) : null}
        </>
      ) : (
        <BodyShort>Ingen varsling</BodyShort>
      )}

      {isEmailNotificationExpired ? (
        <Tag className="mt-2 mb-2" variant="warning-moderate">
          Ditt varsel for dette søket har gått ut
        </Tag>
      ) : null}

      {restartEmailNotificationStatus === FetchStatus.SUCCESS && (
        <Tag className="mt-2 mb-2" variant="success-moderate">
          <div role="status">Ny varsling startet</div>
        </Tag>
      )}

      <HStack className="mt-4" gap="4">
        <Button icon={<PencilIcon aria-hidden="true" />} variant="tertiary" onClick={openSavedSearchModal}>
          Endre
        </Button>
        <Button icon={<TrashIcon aria-hidden="true" />} variant="tertiary" onClick={openConfirmationModal}>
          Slett
        </Button>
        {isEmailNotificationExpired ? (
          <Button
            disabled={restartEmailNotificationStatus === FetchStatus.IS_FETCHING}
            icon={<ArrowsCirclepathIcon aria-hidden="true" />}
            loading={restartEmailNotificationStatus === FetchStatus.IS_FETCHING}
            variant="tertiary"
            onClick={reactivateEmailNotification}
          >
            Start ny varsling
          </Button>
        ) : null}
      </HStack>

      {restartEmailNotificationStatus === FetchStatus.FAILURE && (
        <Alert className="mb-4 mt-4" role="alert" variant="error">
          Det oppsto en feil. Klarte ikke starte ny varsling. Forsøk igjen eller last siden på nytt.
        </Alert>
      )}

      {shouldShowConfirmationModal ? (
        <AlertModal
          confirmLabel="Slett"
          id="confirm-delete-saved-search"
          spinner={isPending}
          title="Slette lagret søk"
          onCancel={() => closeConfirmationModal()}
          onConfirm={deleteSavedSearch}
        >
          {`Sikker på at du vil slette søket "${savedSearch.title}"?`}
        </AlertModal>
      ) : null}

      {shouldShowSavedSearchModal ? (
        <SaveSearchModal
          defaultFormMode={FormModes.UPDATE}
          formData={savedSearch}
          savedSearchUuid={savedSearch.uuid}
          onClose={closeSavedSearchModal}
          onSaveSearchSuccess={handleSavedSearchUpdated}
        />
      ) : null}
    </article>
  );
}

SavedSearchListItem.propTypes = {
  savedSearch: PropTypes.shape({
    uuid: PropTypes.string,
    title: PropTypes.string,
    notifyType: PropTypes.string,
    duration: PropTypes.number,
    updated: PropTypes.string,
    searchQuery: PropTypes.string,
    expired: PropTypes.string,
    status: PropTypes.string,
    expires: PropTypes.string,
  }).isRequired,
  removeSavedSearchFromList: PropTypes.func.isRequired,
  replaceSavedSearchInList: PropTypes.func.isRequired,
  autoOpenModal: PropTypes.bool.isRequired,
  openErrorDialog: PropTypes.func.isRequired,
};

export default SavedSearchListItem;
