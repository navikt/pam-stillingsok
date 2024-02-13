"use client";

import React, { startTransition, useContext, useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@navikt/ds-react";
import { TrashIcon } from "@navikt/aksel-icons";
import SearchResultItem from "../../(sok)/_components/searchResult/SearchResultItem";
import useToggle from "../../_common/hooks/useToggle";
import AlertModal from "../../_common/components/modals/AlertModal";
import { deleteFavouriteAction } from "./actions";
import { FavouritesContext } from "./FavouritesProvider";

function FavouritesListItem({ favourite, onFavouriteDeleted, openErrorDialog }) {
    const [shouldShowConfirmDeleteModal, openConfirmDeleteModal, closeConfirmDeleteModal] = useToggle();
    const { addToPending, removeFormPending, removeFavouriteFromLocalList } = useContext(FavouritesContext);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteConfirmed = () => {
        addToPending(favourite.uuid);
        setIsDeleting(true);
        startTransition(async () => {
            const { success } = await deleteFavouriteAction(favourite.uuid);
            setIsDeleting(false);
            closeConfirmDeleteModal();
            if (!success) {
                openErrorDialog();
            } else {
                onFavouriteDeleted(favourite.uuid);
                removeFavouriteFromLocalList(favourite);
            }
            removeFormPending(favourite.uuid);
        });
    };

    return (
        <>
            <SearchResultItem
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
                showExpired={favourite.favouriteAd.status !== "ACTIVE"}
                favouriteButton={
                    <Button variant="tertiary" onClick={openConfirmDeleteModal} icon={<TrashIcon aria-hidden="true" />}>
                        Slett
                    </Button>
                }
            />

            {shouldShowConfirmDeleteModal && (
                <AlertModal
                    id="confirm-delete-favourite-modal"
                    title="Slette favoritt?"
                    confirmLabel="Slett"
                    onCancel={closeConfirmDeleteModal}
                    onConfirm={handleDeleteConfirmed}
                    spinner={isDeleting}
                >
                    {`Sikker på at du vil slette "${favourite.favouriteAd.title}" fra favoritter?`}
                </AlertModal>
            )}
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
};

export default FavouritesListItem;
