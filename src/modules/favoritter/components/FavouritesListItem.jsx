import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Button } from "@navikt/ds-react";
import { TrashIcon } from "@navikt/aksel-icons";
import SearchResultItem from "../../sok/components/searchResult/SearchResultItem";
import useToggle from "../../common/hooks/useToggle";
import AlertModal from "../../common/components/modals/AlertModal";
import UserAPI from "../../common/api/UserAPI";
import { FavouritesContext } from "../context/FavouritesProvider";
import AlertModalWithPageReload from "../../common/components/modals/AlertModalWithPageReload";

function FavouritesListItem({ favourite, removeFavouriteFromList }) {
    const { addToPending, removeFavouriteFromLocalList, removeFormPending } = useContext(FavouritesContext);
    const [shouldShowConfirmDeleteModal, openConfirmDeleteModal, closeConfirmDeleteModal] = useToggle();
    const [shouldShowErrorDialog, openErrorDialog, closeErrorDialog] = useToggle(false);

    function deleteFavourite() {
        addToPending(favourite.favouriteAd.uuid);
        UserAPI.remove(`api/v1/userfavouriteads/${favourite.uuid}`)
            .then(() => {
                removeFavouriteFromLocalList(favourite);
                removeFavouriteFromList(favourite);
            })
            .catch(() => {
                openErrorDialog();
            })
            .finally(() => {
                removeFormPending(favourite.favouriteAd.uuid);
            });
    }

    function handleDeleteConfirmed() {
        closeConfirmDeleteModal();
        deleteFavourite();
    }

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
                >
                    {`Sikker på at du vil slette "${favourite.favouriteAd.title}" fra favoritter?`}
                </AlertModal>
            )}

            {shouldShowErrorDialog && (
                <AlertModalWithPageReload id="favourites-list-item-error" onClose={closeErrorDialog} title="Feil">
                    Det oppsto en feil ved dine favoritter. Prøv å last siden på nytt
                </AlertModalWithPageReload>
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
    removeFavouriteFromList: PropTypes.func.isRequired,
};

export default FavouritesListItem;
