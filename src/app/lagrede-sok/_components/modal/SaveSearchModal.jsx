"use client";

import React, { useContext, useState } from "react";
import { BodyLong, HStack, Loader, Modal } from "@navikt/ds-react";
import PropTypes from "prop-types";
import { UserContext } from "@/app/_common/user/UserProvider";
import useToggle from "@/app/_common/hooks/useToggle";
import SaveSearchForm from "./SaveSearchForm";
import RegisterEmailForm from "./RegisterEmailForm";
import { isStringEmpty } from "@/app/_common/utils/utils";
import SuccessMessage from "./SuccessMessage";
import ConfirmEmailMessage from "./ConfirmEmailMessage";
import NotFoundMessage from "./NotFoundMessage";

/**
 * This modal let user create a new or edit an existing saved search.
 * If user subscribes to email notifications, this modal will show
 * a second step and ask user to register email address.
 */
function SaveSearchModal({ onClose, onSaveSearchSuccess, formData, defaultFormMode, savedSearchUuid }) {
    const { user } = useContext(UserContext);

    // TODO: isLoading, notFound, errorWhileFetching is just set temporary to keep old functionality
    const { isLoading, setIsLoading } = useState(false);
    const { notFound, setNotFound } = useState(false);
    const { errorWhileFetching, setErrorWhileFetching } = useState(false);

    const [shouldShowSavedSearchForm, showSavedSearchForm, hideSavedSearchForm] = useToggle(true);
    const [shouldShowRegisterEmailForm, showRegisterEmailForm, hideRegisterEmailForm] = useToggle(false);
    const [shouldShowSuccessMessage, showSuccessMessage] = useToggle(false);
    const [shouldShowConfirmEmailMessage, showConfirmEmailMessage] = useToggle(false);

    function fetchSavedSearch(id) {
        // TODO: hent lagret søk på ny?
        setIsLoading(true);

        // dispatch({ type: FetchAction.BEGIN });
        // UserAPI.get(`api/savedsearches/${id}`)
        //     .then((data) => {
        //         dispatch({ type: FetchAction.RESOLVE, data });
        //     })
        //     .catch((error) => {
        //         dispatch({ type: FetchAction.REJECT, error });
        //     });

        setIsLoading(false);
    }

    function handleSavedSearchFormSuccess(response) {
        if (onSaveSearchSuccess) {
            onSaveSearchSuccess(response);
        }

        hideSavedSearchForm();

        if (response.notifyType === "EMAIL" && isStringEmpty(user.email)) {
            showRegisterEmailForm();
        } else {
            showSuccessMessage();
        }
    }

    function handleRegisterEmailSuccess() {
        hideRegisterEmailForm();
        showConfirmEmailMessage();
    }

    /**
     * If editing an existing saved search, fetch this first.
     * Otherwise, just show the save search form right away
     */
    /* useEffect(() => {
        // TODO: Hvorfor hente lagret søk på ny?{
         if (savedSearchUuid) {
             fetchSavedSearch(savedSearchUuid);

         } else {
         showSavedSearchForm();
         }
     }, [savedSearchUuid]); */

    return (
        <Modal onClose={onClose} header={{ heading: "Lagre søk" }} open width="medium" portal>
            {isLoading && (
                <HStack justify="center" className="mt-8 mb-8" role="status">
                    <Loader size="2xlarge" />
                </HStack>
            )}
            {notFound === 404 && <NotFoundMessage />}
            {errorWhileFetching && (
                <Modal.Body>
                    <BodyLong>Feil. Forsøk å laste siden på nytt.</BodyLong>
                </Modal.Body>
            )}

            {shouldShowSavedSearchForm && (
                <SaveSearchForm
                    existingSavedSearch={formData}
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
        </Modal>
    );
}

SaveSearchModal.propTypes = {
    onClose: PropTypes.func,
    onSaveSearchSuccess: PropTypes.func,
    formData: PropTypes.shape({}),
    defaultFormMode: PropTypes.string,
    savedSearchUuid: PropTypes.string,
};

export default SaveSearchModal;
