import React, { useContext, useEffect } from "react";
import { UserContext } from "../../../user/contexts/UserProvider";
import CustomModal from "../../../../common/components/modals/CustomModal";
import UserAPI from "../../../../common/api/UserAPI";
import DelayedSpinner from "../../../../common/components/spinner/DelayedSpinner";
import useToggle from "../../../../common/hooks/useToggle";
import { FetchAction, FetchStatus, useFetchReducer } from "../../../../common/hooks/useFetchReducer";
import SaveSearchForm from "./SaveSearchForm";
import RegisterEmailForm from "./RegisterEmailForm";
import { isStringEmpty } from "../../../../common/components/utils";
import SuccessMessage from "./SuccessMessage";
import ConfirmEmailMessage from "./ConfirmEmailMessage";
import NotFoundMessage from "./NotFoundMessage";
import { BodyLong } from "@navikt/ds-react";

/**
 * This modal let user create a new or edit an existing saved search.
 * If user subscribes to email notifications, this modal will show
 * a second step and ask user to register email address.
 */
function SaveSearchModal({ onClose, onSaveSearchSuccess, formData, defaultFormMode, savedSearchUuid }) {
    const { user } = useContext(UserContext);
    const [shouldShowSavedSearchForm, showSavedSearchForm, hideSavedSearchForm] = useToggle(false);
    const [shouldShowRegisterEmailForm, showRegisterEmailForm, hideRegisterEmailForm] = useToggle(false);
    const [shouldShowSuccessMessage, showSuccessMessage] = useToggle(false);
    const [shouldShowConfirmEmailMessage, showConfirmEmailMessage] = useToggle(false);
    const [existingSearchResponse, dispatch] = useFetchReducer();

    /**
     * If editing an existing saved search, fetch this first.
     * Otherwise, just show the save search form right away
     */
    useEffect(() => {
        if (savedSearchUuid) {
            fetchSavedSearch(savedSearchUuid);
        } else {
            showSavedSearchForm();
        }
    }, [savedSearchUuid]);

    /**
     * When an existing search has loaded, we can show the save search form
     */
    useEffect(() => {
        if (existingSearchResponse.status === FetchStatus.SUCCESS) {
            showSavedSearchForm();
        }
    }, [existingSearchResponse.status]);

    function fetchSavedSearch(id) {
        dispatch({ type: FetchAction.BEGIN });
        UserAPI.get(`api/v1/savedsearches/${id}`)
            .then((data) => {
                dispatch({ type: FetchAction.RESOLVE, data });
            })
            .catch((error) => {
                dispatch({ type: FetchAction.REJECT, error });
            });
    }

    function handleSavedSearchFormSuccess(response) {
        if (onSaveSearchSuccess) {
            onSaveSearchSuccess(response);
        }

        hideSavedSearchForm();

        if (response.notifyType === "EMAIL" && isStringEmpty(user.data.email)) {
            showRegisterEmailForm();
        } else {
            showSuccessMessage();
        }
    }

    function handleRegisterEmailSuccess() {
        hideRegisterEmailForm();
        showConfirmEmailMessage();
    }

    const { status, data, error } = existingSearchResponse;

    return (
        <CustomModal onCloseClick={onClose} title="Lagre søk">
            {status === FetchStatus.IS_FETCHING && <DelayedSpinner />}
            {status === FetchStatus.FAILURE && error.statusCode === 404 && <NotFoundMessage />}
            {status === FetchStatus.FAILURE && error.statusCode !== 404 && (
                <BodyLong>Feil. Forsøk å laste siden på nytt.</BodyLong>
            )}

            {shouldShowSavedSearchForm && (
                <SaveSearchForm
                    existingSavedSearch={data}
                    formData={formData}
                    defaultFormMode={defaultFormMode}
                    onClose={onClose}
                    onSuccess={handleSavedSearchFormSuccess}
                />
            )}

            {shouldShowRegisterEmailForm && (
                <RegisterEmailForm onClose={onClose} onSuccess={handleRegisterEmailSuccess} />
            )}

            {shouldShowSuccessMessage && <SuccessMessage onClose={onClose} />}

            {shouldShowConfirmEmailMessage && <ConfirmEmailMessage onClose={onClose} />}
        </CustomModal>
    );
}

export default SaveSearchModal;