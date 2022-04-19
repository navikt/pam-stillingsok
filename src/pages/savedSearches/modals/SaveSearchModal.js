import React, { useContext, useEffect, useState } from "react";
import { Checkbox, Fieldset, Input, Radio, SkjemaGruppe } from "nav-frontend-skjema";
import { isStringEmpty } from "../../../components/utils";
import { UserContext } from "../../../context/UserProvider";
import { Hovedknapp, Knapp } from "@navikt/arbeidsplassen-knapper";
import CustomModal from "../../../components/modals/CustomModal";
import { adUserApiGet, adUserApiPost, adUserApiPut } from "../../../api/aduser/adUserApi";
import { NotificationsContext } from "../../../context/NotificationsProvider";
import DelayedSpinner from "../../../components/spinner/DelayedSpinner";
import useToggle from "../../../hooks/useToggle";
import {FetchAction, FetchStatus, useFetchReducer} from "../../../hooks/useFetchReducer";
import Alert from "../../../components/alert/Alert";

function SaveSearchModal({ onClose, onSuccess, formData, defaultMode, savedSearchAsId, askIfReplaceOrUpdate }) {
    const { user } = useContext(UserContext);
    const { notifySuccess } = useContext(NotificationsContext);

    // Fetch
    const shouldFetch = savedSearchAsId !== undefined;
    const [savedSearchResponse, dispatch] = useFetchReducer();
    const [saveStatus, setSaveStatus] = useState(FetchStatus.NOT_FETCHED);

    // Form modes
    const [formMode, setFormMode] = useState(defaultMode);
    const [shouldShowForm, showForm, hideForm] = useToggle(!askIfReplaceOrUpdate);

    // Form data
    const [title, setTitle] = useState(formData.title);
    const [notifyType, setNotifyType] = useState(formData.notifyType);
    const [duration, setDuration] = useState(formData.duration ? formData.duration : 30);

    // Validation
    const [titleValidationError, setTitleValidationError] = useState(undefined);

    let titleRef;

    useEffect(() => {
        if (shouldFetch) {
            fetchSavedSearch(savedSearchAsId);
        }
    }, [shouldFetch]);

    function fetchSavedSearch(id) {
        dispatch({ type: FetchAction.BEGIN });
        adUserApiGet(`api/v1/savedsearches/${id}`)
            .then((data) => {
                dispatch({ type: FetchAction.RESOLVE, data });
            })
            .catch((error) => {
                dispatch({ type: FetchAction.REJECT, error });
            });
    }

    async function onFormSubmit(e) {
        e.preventDefault();

        if (validateForm()) {
            setSaveStatus(FetchStatus.IS_FETCHING);

            let data = {
                title,
                notifyType,
                duration: notifyType === "NONE" ? 0 : duration,
                status: notifyType === "NONE" ? "INACTIVE" : "ACTIVE",
                searchQuery: formData.searchQuery
            };

            if (formMode === "add") {
                adUserApiPost("api/v1/savedsearches/", data).then((response) => {
                    if (onSuccess) {
                        onSuccess(response);
                    }
                });
            } else {
                if (formMode === "replace") {
                    data = {
                        ...savedSearchResponse.data,
                        ...data
                    };
                } else if (formMode === "update-search-query-only") {
                    data = {
                        ...savedSearchResponse.data,
                        searchQuery: formData.searchQuery
                    };
                }
                adUserApiPut(`api/v1/savedsearches/${savedSearchResponse.data.uuid}`, data)
                    .then((response) => {
                        setSaveStatus(FetchStatus.SUCCESS);
                        if (onSuccess) {
                            onSuccess(response);
                        }
                        notifySuccess("Søket er oppdatert.");
                    })
                    .catch(() => {
                        setSaveStatus(FetchStatus.FAILURE);
                    });
            }
        }
    }

    function validateForm() {
        let isValid = true;

        if (title.trim().length === 0) {
            isValid = false;
            setTitleValidationError("Tittel mangler");
            titleRef.focus();
        } else {
            setTitleValidationError(undefined);
        }

        return isValid;
    }

    function onFormModeChange(e) {
        const value = e.target.value;
        if (value === "add") {
            showForm();
        } else {
            hideForm();
        }
        setFormMode(value);
    }

    function onTitleChange(e) {
        setTitle(e.target.value);
        setTitleValidationError(false);
    }

    function onSubscribeChange(e) {
        if (e.target.checked) {
            setNotifyType("EMAIL");
        } else {
            setNotifyType("NONE");
        }
    }

    function onDurationChange(e) {
        setDuration(parseInt(e.target.value, 10));
    }

    return (
        <CustomModal onCloseClick={onClose} title="Lagre søk">
            {shouldFetch && savedSearchResponse.status !== FetchStatus.SUCCESS ? (
                <React.Fragment>
                    {savedSearchResponse.status === FetchStatus.NOT_FETCHED ||
                    savedSearchResponse.status === FetchStatus.IS_FETCHING ? (
                        <DelayedSpinner />
                    ) : (
                        <React.Fragment>
                            <p>Det oppsto en feil. Forsøk å laste siden på nytt</p>
                            <Hovedknapp onClick={onClose}>Lukk</Hovedknapp>
                        </React.Fragment>
                    )}
                </React.Fragment>
            ) : (
                <form onSubmit={onFormSubmit}>
                    {askIfReplaceOrUpdate && savedSearchResponse.data && (
                        <Fieldset
                            legend={`Ønsker du å lagre endringene for ${savedSearchResponse.data.title} eller lagre et nytt søk?`}
                        >
                            <Radio
                                label="Lagre endringene"
                                name="add_or_replace"
                                value="update-search-query-only"
                                onChange={onFormModeChange}
                                checked={formMode === "update-search-query-only"}
                            />
                            <Radio
                                label="Lagre nytt søk"
                                name="add_or_replace"
                                value="add"
                                onChange={onFormModeChange}
                                checked={formMode === "add"}
                            />
                        </Fieldset>
                    )}

                    {shouldShowForm && (
                        <React.Fragment>
                            <Input
                                id="SavedSearchModal__name"
                                className="SavedSearchModal__body__name"
                                label="Navn*"
                                onChange={onTitleChange}
                                value={title}
                                feil={titleValidationError ? { feilmelding: titleValidationError } : undefined}
                                inputRef={(el) => {
                                    titleRef = el;
                                }}
                            />
                            <Checkbox
                                className="SavedSearchModal__body__notify"
                                label="Ja, jeg ønsker å motta e-post med varsel om nye treff"
                                onChange={onSubscribeChange}
                                checked={notifyType === "EMAIL"}
                            />
                            {notifyType === "EMAIL" && (
                                <React.Fragment>
                                    <SkjemaGruppe className="blokk-s">
                                        <Fieldset legend="Varighet på varsel:">
                                            <Radio
                                                label="30 dager"
                                                className="SavedSearchModal__body__duration"
                                                name="duration"
                                                value="30"
                                                onChange={onDurationChange}
                                                checked={duration === 30}
                                            />
                                            <Radio
                                                label="60 dager"
                                                className="SavedSearchModal__body__duration"
                                                name="duration"
                                                value="60"
                                                onChange={onDurationChange}
                                                checked={duration === 60}
                                            />
                                            <Radio
                                                label="90 dager"
                                                className="SavedSearchModal__body__duration"
                                                name="duration"
                                                value="90"
                                                onChange={onDurationChange}
                                                checked={duration === 90}
                                            />
                                        </Fieldset>
                                    </SkjemaGruppe>

                                    {!isStringEmpty(user.data.email) && (
                                        <p>
                                            Varsel sendes til {user.data.email}. Gå til{" "}
                                            <a href="/personinnstillinger" className="link">
                                                Innstillinger
                                            </a>{" "}
                                            for å endre.
                                        </p>
                                    )}
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    )}
                    {saveStatus === FetchStatus.FAILURE && (
                        <Alert>Noe gikk galt ved lagring, forsøk igjen eller last siden på nytt</Alert>
                    )}
                    <div className="SaveSearchForm__buttons">
                        <Hovedknapp
                            htmlType="submit"
                            spinner={saveStatus === FetchStatus.IS_FETCHING}
                            disabled={saveStatus === FetchStatus.IS_FETCHING}
                        >
                            Lagre
                        </Hovedknapp>
                        <Knapp htmlType="button" onClick={onClose}>
                            Avbryt
                        </Knapp>
                    </div>
                </form>
            )}
        </CustomModal>
    );
}

export default SaveSearchModal;
