"use client";

import React, { ReactElement, useContext, useEffect, useState } from "react";
import { BodyLong, HStack, Loader, Modal } from "@navikt/ds-react";
import { UserContext } from "@/app/_common/user/UserProvider";
import useToggle from "@/app/_common/hooks/useToggle";
import { isStringEmpty } from "@/app/_common/utils/utils";
import * as actions from "@/app/_common/actions";
import NotFoundMessage from "@/app/lagrede-sok/_components/modal/NotFoundMessage";
import AlertModalWithPageReload from "@/app/_common/components/modals/AlertModalWithPageReload";
import { GetSavedSearchResponse, SavedSearch } from "@/app/_common/actions/savedSearchActions";
import SaveSearchForm, { SaveSearchFormData } from "./SaveSearchForm";
import RegisterEmailForm from "./RegisterEmailForm";
import SuccessMessage from "./SuccessMessage";
import ConfirmEmailMessage from "./ConfirmEmailMessage";

interface SaveSearchModalProps {
    onClose: () => void;
    onSaveSearchSuccess?: (response: SavedSearch) => void;
    formData: SaveSearchFormData;
    defaultFormMode?: string;
    savedSearchUuid?: string | null;
}

/**
 * This modal let user create a new or edit an existing saved search.
 * If user subscribes to email notifications, this modal will show
 * a second step and ask user to register email address.
 */
function SaveSearchModal({
    onClose,
    onSaveSearchSuccess,
    formData,
    defaultFormMode,
    savedSearchUuid,
}: SaveSearchModalProps): ReactElement {
    const { user } = useContext(UserContext);

    const [shouldShowSavedSearchForm, showSavedSearchForm, hideSavedSearchForm] = useToggle(true);
    const [shouldShowRegisterEmailForm, showRegisterEmailForm, hideRegisterEmailForm] = useToggle(false);
    const [shouldShowSuccessMessage, showSuccessMessage] = useToggle(false);
    const [shouldShowConfirmEmailMessage, showConfirmEmailMessage] = useToggle(false);
    const [existingSavedSearch, setExistingSavedSearch] = useState<SavedSearch>();
    const [showError, setShowError] = useState(false);
    const [showNotFoundError, setShowNotFoundError] = useState(false);

    /**
     * If editing an existing saved search, fetch this first.
     * Otherwise, just show the save search form right away
     */
    useEffect(() => {
        async function getSavedSearch(uuid: string): Promise<GetSavedSearchResponse> {
            return actions.getSavedSearchAction(uuid);
        }

        if (savedSearchUuid) {
            getSavedSearch(savedSearchUuid)
                .then((savedSearch) => {
                    if (savedSearch.success) {
                        setExistingSavedSearch(savedSearch.data);
                    } else if (savedSearch.statusCode === 404) {
                        setShowNotFoundError(true);
                    } else {
                        setShowError(true);
                    }
                })
                .catch(() => {
                    setShowError(true);
                });
        } else {
            showSavedSearchForm();
        }
    }, [savedSearchUuid]);

    function handleSavedSearchFormSuccess(response: SavedSearch): void {
        if (onSaveSearchSuccess) {
            onSaveSearchSuccess(response);
        }

        hideSavedSearchForm();

        if (response.notifyType === "EMAIL" && isStringEmpty(user?.email)) {
            showRegisterEmailForm();
        } else {
            showSuccessMessage();
        }
    }

    function handleRegisterEmailSuccess(): void {
        hideRegisterEmailForm();
        showConfirmEmailMessage();
    }

    if (showError) {
        return (
            <AlertModalWithPageReload onClose={onClose} id="lagrede-sok-error" title="En feil har skjedd">
                <BodyLong>Vennligst forsøk å laste siden på nytt.</BodyLong>
            </AlertModalWithPageReload>
        );
    }

    return (
        <Modal onClose={onClose} header={{ heading: "Lagre søk" }} open width="medium" portal>
            {showNotFoundError ? (
                <NotFoundMessage onClose={onClose} />
            ) : (
                <>
                    {savedSearchUuid && !existingSavedSearch && (
                        <HStack justify="center">
                            <Loader size="xlarge" />
                        </HStack>
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
                </>
            )}
        </Modal>
    );
}

export default SaveSearchModal;
