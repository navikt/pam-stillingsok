"use client";

import React, { useContext, useEffect, useState } from "react";
import { BodyLong, Modal } from "@navikt/ds-react";
import PropTypes from "prop-types";
import { UserContext } from "@/app/_common/user/UserProvider";
import useToggle from "@/app/_common/hooks/useToggle";
import SaveSearchForm from "./SaveSearchForm";
import RegisterEmailForm from "./RegisterEmailForm";
import { isStringEmpty } from "@/app/_common/utils/utils";
import SuccessMessage from "./SuccessMessage";
import ConfirmEmailMessage from "./ConfirmEmailMessage";
import * as actions from "@/app/_common/actions";
import NotFoundMessage from "@/app/lagrede-sok/_components/modal/NotFoundMessage";

/**
 * This modal let user create a new or edit an existing saved search.
 * If user subscribes to email notifications, this modal will show
 * a second step and ask user to register email address.
 */
function SaveSearchModal({ onClose, onSaveSearchSuccess, formData, defaultFormMode, savedSearchUuid }) {
    const { user } = useContext(UserContext);

    const [shouldShowSavedSearchForm, showSavedSearchForm, hideSavedSearchForm] = useToggle(true);
    const [shouldShowRegisterEmailForm, showRegisterEmailForm, hideRegisterEmailForm] = useToggle(false);
    const [shouldShowSuccessMessage, showSuccessMessage] = useToggle(false);
    const [shouldShowConfirmEmailMessage, showConfirmEmailMessage] = useToggle(false);
    const [existingSavedSearch, setExistingSavedSearch] = useState({});
    const [showError, setShowError] = useState(false);
    const [showNotFoundError, setShowNotFoundError] = useState(false);

    /**
     * If editing an existing saved search, fetch this first.
     * Otherwise, just show the save search form right away
     */
    useEffect(() => {
        async function getSavedSearch(uuid) {
            return await actions.getSavedSearchAction(uuid);
        }

        if (savedSearchUuid) {
            getSavedSearch(savedSearchUuid).then((savedSearch) => {
                if (savedSearch.success) {
                    setExistingSavedSearch(savedSearch.data);
                } else {
                    if (savedSearch.statusCode === 404) {
                        setShowNotFoundError(true);
                    } else {
                        setShowError(true);
                    }
                }
            });
        } else {
            showSavedSearchForm();
        }
    }, [savedSearchUuid]);

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

    return (
        <Modal onClose={onClose} header={{ heading: "Lagre søk" }} open width="medium" portal>
            {showNotFoundError && <NotFoundMessage />}
            {showError && (
                <Modal.Body>
                    <BodyLong>En feil har skjedd. Vennligst forsøk å laste siden på nytt.</BodyLong>
                </Modal.Body>
            )}

            {shouldShowSavedSearchForm && (
                <SaveSearchForm
                    existingSavedSearch={existingSavedSearch}
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
