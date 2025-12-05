"use client";

import React, { useContext, useState } from "react";
import { Button } from "@navikt/ds-react";
import { TrashIcon } from "@navikt/aksel-icons";
import SearchResultItem from "@/app/stillinger/(sok)/_components/searchResult/SearchResultItem";
import useToggle from "@/app/stillinger/_common/hooks/useToggle";
import AlertModal from "@/app/stillinger/_common/components/modals/AlertModal";
import * as actions from "@/app/stillinger/_common/actions";
import { FavouritesContext } from "./FavouritesProvider";
import { Favourite } from "@/app/stillinger/_common/types/Favorite";

interface FavouriteInternal {
    uuid: string;
    favouriteAd: Favourite;
}

interface FavouritesListItemProps {
    favourite: FavouriteInternal;
    onFavouriteDeleted: (uuid: string) => void;
    openErrorDialog: () => void;
}

function FavouritesListItem({ favourite, onFavouriteDeleted, openErrorDialog }: FavouritesListItemProps): JSX.Element {
    const [shouldShowConfirmDeleteModal, openConfirmDeleteModal, closeConfirmDeleteModal] = useToggle();
    const { addToPending, removeFormPending, removeFavouriteFromLocalList } = useContext(FavouritesContext);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteConfirmed = async (): Promise<void> => {
        addToPending(favourite.uuid);
        setIsDeleting(true);
        let isSuccess: boolean;
        try {
            const result = await actions.deleteFavouriteAction(favourite.uuid);
            isSuccess = result.success;
        } catch {
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
                ad={{
                    uuid: favourite.favouriteAd.uuid,
                    title: favourite.favouriteAd.title,
                    published: favourite.favouriteAd.published,
                    source: favourite.favouriteAd.source,
                    employer: { name: favourite.favouriteAd.employer },
                    jobTitle: favourite.favouriteAd.jobTitle,
                    location: favourite.favouriteAd.location,
                    applicationDue: favourite.favouriteAd.applicationdue,
                    hasSuperraskSoknad: favourite.favouriteAd.hasSuperraskSoknad.toString(),
                }}
                favoriteLocation={favourite.favouriteAd.location}
                showExpired={favourite.favouriteAd.status !== "ACTIVE"}
                favouriteButton={
                    <Button variant="tertiary" onClick={openConfirmDeleteModal} icon={<TrashIcon aria-hidden="true" />}>
                        Slett
                    </Button>
                }
                isDebug={false}
                isFavourites={true}
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

export default FavouritesListItem;
