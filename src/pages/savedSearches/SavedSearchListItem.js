import AlertStripe from "nav-frontend-alertstriper";
import PropTypes from "prop-types";
import React, { useContext, useState } from "react";
import { CONTEXT_PATH } from "../../environment";
import { formatISOString, isValidISOString } from "../../utils/utils";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import SaveSearchModal from "./modals/SaveSearchModal";
import { adUserApiPut, adUserApiRemove } from "../../api/adUserApi";
import { NotificationsContext } from "../../context/NotificationsProvider";
import useToggle from "../../hooks/useToggle";
import { FetchStatus } from "../../hooks/useFetchReducer";
import DeleteButton from "../../components/buttons/DeleteButton";
import EditButton from "../../components/buttons/EditButton";
import RefreshButton from "../../components/buttons/RefreshButton";

function SavedSearchListItem({ savedSearch, removeSavedSearchFromList, replaceSavedSearchInList, autoOpenModal }) {
    const { notifySuccess, notifyError } = useContext(NotificationsContext);
    const [deleteStatus, setDeleteStatus] = useState(FetchStatus.NOT_FETCHED);
    const [shouldShowDeleteModal, openDeleteModal, hideDeleteModal] = useToggle();
    const [shouldShowFormModal, openFormModal, hideFormModal] = useToggle(autoOpenModal);
    const [extendDurationStatus, setExtendDurationStatus] = useState(FetchStatus.NOT_FETCHED);

    function deleteSavedSearch() {
        setDeleteStatus(FetchStatus.IS_FETCHING);
        adUserApiRemove(`/api/v1/savedsearches/${savedSearch.uuid}`)
            .then(() => {
                hideDeleteModal();
                setDeleteStatus(FetchStatus.SUCCESS);
                removeSavedSearchFromList(savedSearch);
            })
            .catch(() => {
                setDeleteStatus(FetchStatus.FAILURE);
            });
    }

    function extendDuration() {
        setExtendDurationStatus(FetchStatus.IS_FETCHING);

        adUserApiPut(`api/v1/savedsearches/${savedSearch.uuid}`, {
            ...savedSearch,
            status: "ACTIVE"
        })
            .then((response) => {
                setExtendDurationStatus(FetchStatus.SUCCESS);
                replaceSavedSearchInList(response);
                notifySuccess(`Ny varsling startet for "${savedSearch.title}"`);
            })
            .catch(() => {
                notifyError("Det oppsto en feil. Forsøk å laste siden på nytt");
                setExtendDurationStatus(FetchStatus.FAILURE);
            });
    }

    function onConfirmModalClose() {
        hideDeleteModal();
        setDeleteStatus(FetchStatus.NOT_FETCHED);
    }

    function onSaveSearchModalSuccess(response) {
        hideFormModal();
        replaceSavedSearchInList(response);
    }

    return (
        <article className="SavedSearchListItem">
            <a className="link" href={`${CONTEXT_PATH}${savedSearch.searchQuery}&saved=${savedSearch.uuid}`}>
                <h3 className="SavedSearchListItem__title">{savedSearch.title}</h3>
            </a>

            {isValidISOString(savedSearch.updated) && (
                <p className="SavedSearchListItem__created">
                    Sist endret: {formatISOString(savedSearch.updated, "DD.MM.YYYY")}
                </p>
            )}

            {savedSearch.notifyType === "EMAIL" ? (
                <React.Fragment>
                    <p>Varighet på varsel: {savedSearch.duration} dager</p>
                    {isValidISOString(savedSearch.expires) && (
                        <p>Utløper: {formatISOString(savedSearch.expires, "DD.MM.YYYY")}</p>
                    )}
                </React.Fragment>
            ) : (
                <p>Ingen varsling</p>
            )}

            <div className="SavedSearchListItem__bottom">
                <EditButton onClick={openFormModal} />
                <DeleteButton onClick={openDeleteModal} />
            </div>

            {savedSearch.status === "INACTIVE" && savedSearch.notifyType === "EMAIL" && (
                <AlertStripe type="advarsel" className="SavedSearchListItem__alertstripe alertstripe--solid">
                    Ditt varsel for dette søket har gått ut
                    <RefreshButton
                        onClick={extendDuration}
                        disabled={extendDurationStatus === FetchStatus.IS_FETCHING}
                        spinner={extendDurationStatus === FetchStatus.IS_FETCHING}
                        text="Start ny varsling"
                    />
                </AlertStripe>
            )}

            {shouldShowDeleteModal && (
                <ConfirmationModal
                    onCancel={onConfirmModalClose}
                    onConfirm={deleteSavedSearch}
                    confirmLabel="Slett"
                    title="Slette lagret søk"
                    spinner={deleteStatus === FetchStatus.IS_FETCHING}
                    errorMessage={deleteStatus === FetchStatus.FAILURE ? "Noe gikk galt, forsøk igjen" : undefined}
                >
                    Sikker på at du vil slette søket &laquo;{savedSearch.title}&raquo;?
                </ConfirmationModal>
            )}

            {shouldShowFormModal && (
                <SaveSearchModal
                    onSuccess={onSaveSearchModalSuccess}
                    onClose={hideFormModal}
                    savedSearchAsId={savedSearch.uuid}
                    formData={savedSearch}
                    defaultMode="replace"
                />
            )}
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
        expired: PropTypes.string
    }).isRequired
};

export default SavedSearchListItem;
