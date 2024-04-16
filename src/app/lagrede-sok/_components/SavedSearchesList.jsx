'use client';

import { Heading, VStack } from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import AlertModalWithPageReload from '@/app/_common/components/modals/AlertModalWithPageReload';
import useToggle from '@/app/_common/hooks/useToggle';
import NoSavedSearches from '@/app/lagrede-sok/_components/NoSavedSearches';

import SavedSearchListItem from './SavedSearchListItem';

/**
 * Displays a list of all saved searches.
 * If browser url contains a parameter ?uuid, for example
 * when clicking a link in a received notification email,
 * this view will auto open the edit modal for the saved search with that uuid
 */
const SavedSearchesList = ({ data, uuid }) => {
  const [localSavedSearchesList, setLocalSavedSearchesList] = useState(data);
  const [shouldShowErrorModal, openErrorDialog, closeErrorDialog] = useToggle();

  function updateSavedSearchInList(updated) {
    setLocalSavedSearchesList(
      localSavedSearchesList.map((old) => (old.id === updated.id ? { ...updated, uuid: old.uuid } : old)),
    );
  }

  function removeSavedSearchFromList(removed) {
    setLocalSavedSearchesList(localSavedSearchesList.filter((it) => it.uuid !== removed.uuid));
  }

  if (localSavedSearchesList.length === 0) {
    return <NoSavedSearches />;
  }

  return (
    <section className="container-medium mt-10 mb-24">
      <Heading className="mb-12" level="1" size="xlarge">
        Lagrede søk
      </Heading>
      <VStack gap="10">
        {localSavedSearchesList.map((savedSearch) => (
          <SavedSearchListItem
            key={savedSearch.uuid}
            autoOpenModal={savedSearch.uuid === uuid}
            openErrorDialog={openErrorDialog}
            removeSavedSearchFromList={removeSavedSearchFromList}
            replaceSavedSearchInList={updateSavedSearchInList}
            savedSearch={savedSearch}
          />
        ))}
      </VStack>
      {shouldShowErrorModal ? (
        <AlertModalWithPageReload
          id="delete-saved-search-error"
          title="Feil ved sletting"
          onClose={closeErrorDialog}
        >
          Forsøk å laste siden på nytt eller prøv igjen om en liten stund.
        </AlertModalWithPageReload>
      ) : null}
    </section>
  );
};

SavedSearchesList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  uuid: PropTypes.string,
};

export default SavedSearchesList;
