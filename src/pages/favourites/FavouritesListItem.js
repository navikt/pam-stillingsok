import React, { useContext } from "react";
import SearchResultItem from "../search/searchResult/SearchResultItem";
import useToggle from "../../hooks/useToggle";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import UserAPI from "../../api/UserAPI";
import { captureException } from "@sentry/browser";
import { FavouritesContext } from "../../context/FavouritesProvider";
import ErrorWithReloadPageModal from "../../components/modals/ErrorWithReloadPageModal";
import DeleteButton from "../../components/buttons/DeleteButton";

function FavouritesListItem({ favourite, removeFavouriteFromList }) {
    const favouritesProvider = useContext(FavouritesContext);
    const [shouldShowConfirmDeleteModal, openConfirmDeleteModal, closeConfirmDeleteModal] = useToggle();
    const [shouldShowErrorDialog, openErrorDialog, closeErrorDialog] = useToggle(false);

    function deleteFavourite() {
        favouritesProvider.addToPending(favourite.favouriteAd.uuid);
        UserAPI.remove(`api/v1/userfavouriteads/${favourite.uuid}`)
            .then(() => {
                favouritesProvider.removeFavouriteFromLocalList(favourite);
                removeFavouriteFromList(favourite);
            })
            .catch((err) => {
                captureException(err);
                openErrorDialog();
            })
            .finally(() => {
                favouritesProvider.removeFormPending(favourite.favouriteAd.uuid);
            });
    }

    function handleDeleteConfirmed() {
        closeConfirmDeleteModal();
        deleteFavourite();
    }

    return (
        <React.Fragment>
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
                        applicationdue: favourite.favouriteAd.applicationdue
                    }
                }}
                showExpired={favourite.favouriteAd.status !== "ACTIVE"}
                favouriteButton={<DeleteButton onClick={openConfirmDeleteModal}>Slett</DeleteButton>}
            />

            {shouldShowConfirmDeleteModal && (
                <ConfirmationModal
                    title="Slette favoritt?"
                    onCancel={closeConfirmDeleteModal}
                    onConfirm={handleDeleteConfirmed}
                >
                    Sikker på at du vil fjerne &laquo;{favourite.favouriteAd.title}&raquo; fra favoritter?
                </ConfirmationModal>
            )}

            {shouldShowErrorDialog && (
                <ErrorWithReloadPageModal onClose={closeErrorDialog} title="Feil">
                    Det oppsto en feil ved dine favoritter. Prøv å last siden på nytt
                </ErrorWithReloadPageModal>
            )}
        </React.Fragment>
    );
}

FavouritesListItem.propTypes = {};

export default FavouritesListItem;
