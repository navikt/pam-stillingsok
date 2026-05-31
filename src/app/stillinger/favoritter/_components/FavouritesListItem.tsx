"use client";

import { TrashIcon } from "@navikt/aksel-icons";
import { Box, Button } from "@navikt/ds-react";
import { useContext, useState } from "react";
import * as actions from "@/app/stillinger/_common/actions";
import AlertModal from "@/app/stillinger/_common/components/modals/AlertModal";
import useToggle from "@/app/stillinger/_common/hooks/useToggle";
import SearchResultItem from "@/app/stillinger/(sok)/_components/searchResult/SearchResultItem";
import type { FavouriteInternal } from "@/app/stillinger/favoritter/types/FavouriteInternal";
import { FavouritesContext } from "./FavouritesProvider";

interface FavouritesListItemProps {
    favourite: FavouriteInternal;
    onFavouriteDeleted: (uuid: string) => void;
    openErrorDialog: () => void;
}

function FavouritesListItem({ favourite, onFavouriteDeleted, openErrorDialog }: FavouritesListItemProps) {
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
        <Box borderRadius="8" padding="space-16" background="default">
            <div className="mb-6">
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
                    isDebug={false}
                    isFavourites={true}
                />
            </div>
            <Button
                size="small"
                variant="secondary"
                onClick={openConfirmDeleteModal}
                icon={<TrashIcon aria-hidden="true" />}
            >
                Slett favoritt
            </Button>

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
        </Box>
    );
}

export default FavouritesListItem;
