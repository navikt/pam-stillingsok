'use client';

import { TrashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';

import SearchResultItem from '@/app/(sok)/_components/searchResult/SearchResultItem';
import * as actions from '@/app/_common/actions';
import AlertModal from '@/app/_common/components/modals/AlertModal';
import useToggle from '@/app/_common/hooks/useToggle';

import { FavouritesContext } from './FavouritesProvider';

function FavouritesListItem({ favourite, onFavouriteDeleted, openErrorDialog }) {
  const [shouldShowConfirmDeleteModal, openConfirmDeleteModal, closeConfirmDeleteModal] = useToggle();
  const { addToPending, removeFormPending, removeFavouriteFromLocalList } = useContext(FavouritesContext);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirmed = async () => {
    addToPending(favourite.uuid);
    setIsDeleting(true);
    let isSuccess;
    try {
      const result = await actions.deleteFavouriteAction(favourite.uuid);
      isSuccess = result.success;
    } catch (err) {
      isSuccess = false;
    }
    setIsDeleting(false);
    closeConfirmDeleteModal();
    if (isSuccess) {
      onFavouriteDeleted(favourite.uuid);
      removeFavouriteFromLocalList(favourite);
    } else {
      openErrorDialog();
    }
    removeFormPending(favourite.uuid);
  };

  return (
    <>
      <SearchResultItem
        showExpired={favourite.favouriteAd.status !== 'ACTIVE'}
        ad={{
          uuid: favourite.favouriteAd.uuid,
          title: favourite.favouriteAd.title,
          published: favourite.favouriteAd.published,
          source: favourite.favouriteAd.source,
          reference: favourite.favouriteAd.reference,
          properties: {
            employer: favourite.favouriteAd.employer,
            jobtitle: favourite.favouriteAd.jobTitle,
            location: favourite.favouriteAd.location,
            applicationdue: favourite.favouriteAd.applicationdue,
          },
        }}
        favouriteButton={(
          <Button icon={<TrashIcon aria-hidden="true" />} variant="tertiary" onClick={openConfirmDeleteModal}>
            Slett
          </Button>
                  )}
      />

      {shouldShowConfirmDeleteModal ? (
        <AlertModal
          confirmLabel="Slett"
          id="confirm-delete-favourite-modal"
          spinner={isDeleting}
          title="Slette favoritt?"
          onCancel={closeConfirmDeleteModal}
          onConfirm={handleDeleteConfirmed}
        >
          {`Sikker på at du vil slette "${favourite.favouriteAd.title}" fra favoritter?`}
        </AlertModal>
      ) : null}
    </>
  );
}

FavouritesListItem.propTypes = {
  favourite: PropTypes.shape({
    uuid: PropTypes.string,
    favouriteAd: PropTypes.shape({
      title: PropTypes.string,
      status: PropTypes.string,
      uuid: PropTypes.string,
      published: PropTypes.string,
      applicationdue: PropTypes.string,
      location: PropTypes.string,
      jobTitle: PropTypes.string,
      employer: PropTypes.string,
      reference: PropTypes.string,
      source: PropTypes.string,
    }),
  }),
  openErrorDialog: PropTypes.func.isRequired,
  onFavouriteDeleted: PropTypes.func.isRequired,
};

export default FavouritesListItem;
