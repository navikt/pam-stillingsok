import React, { useContext, useState } from "react";
import { captureException } from "@sentry/browser";
import { Checkbox, Fieldset, Input, Radio, SkjemaGruppe } from "nav-frontend-skjema";
import { UserContext } from "../../../user/contexts/UserProvider";
import { Hovedknapp, Knapp } from "@navikt/arbeidsplassen-knapper";
import useToggle from "../../../../common/hooks/useToggle";
import { FetchStatus } from "../../../../common/hooks/useFetchReducer";
import Alert from "../../../../common/components/alert/Alert";
import { isStringEmpty } from "../../../../common/components/utils";
import UserAPI from "../../../../common/api/UserAPI";

export const FormModes = {
    ADD: "ADD",
    UPDATE: "UPDATE",
    UPDATE_QUERY_ONLY: "UPDATE_QUERY_ONLY"
};

/**
 * Form for creating or updating a saved search.
 */
function SaveSearchForm({ existingSavedSearch, onClose, onSuccess, formData, defaultFormMode }) {
    const { user } = useContext(UserContext);

    // Fetch
    const [saveStatus, setSaveStatus] = useState(FetchStatus.NOT_FETCHED);

    // Form modes
    const [formMode, setFormMode] = useState(defaultFormMode);
    const [shouldShowForm, showForm, hideForm] = useToggle(defaultFormMode !== FormModes.UPDATE_QUERY_ONLY);

    // Form data
    const [title, setTitle] = useState(formData.title);
    const [notifyType, setNotifyType] = useState(formData.notifyType ? formData.notifyType : "NONE");
    const [duration, setDuration] = useState(formData.duration ? formData.duration : 30);

    // Validation
    const [titleValidationError, setTitleValidationError] = useState(undefined);

    let titleRef;

    function handleFormSubmit(e) {
        e.preventDefault();
        if (validateForm()) {
            setSaveStatus(FetchStatus.IS_FETCHING);

            let dataToBeSaved = {
                title,
                notifyType,
                duration: notifyType === "NONE" ? 0 : duration,
                status: notifyType === "NONE" ? "INACTIVE" : "ACTIVE",
                searchQuery: formData.searchQuery
            };

            if (formMode === FormModes.ADD) {
                UserAPI.post("api/v1/savedsearches/", dataToBeSaved)
                    .then((response) => {
                        setSaveStatus(FetchStatus.SUCCESS);
                        if (onSuccess) {
                            onSuccess(response);
                        }
                    })
                    .catch((err) => {
                        captureException(err);
                        setSaveStatus(FetchStatus.FAILURE);
                    });
            } else {
                if (formMode === FormModes.UPDATE) {
                    dataToBeSaved = {
                        ...existingSavedSearch,
                        ...dataToBeSaved
                    };
                } else if (formMode === FormModes.UPDATE_QUERY_ONLY) {
                    dataToBeSaved = {
                        ...existingSavedSearch,
                        searchQuery: formData.searchQuery
                    };
                }

                UserAPI.put(`api/v1/savedsearches/${existingSavedSearch.uuid}`, dataToBeSaved)
                    .then((response) => {
                        setSaveStatus(FetchStatus.SUCCESS);
                        if (onSuccess) {
                            onSuccess(response);
                        }
                    })
                    .catch((err) => {
                        captureException(err);
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

    function handleFormModeChange(e) {
        const value = e.target.value;
        if (value === FormModes.ADD) {
            showForm();
        } else {
            hideForm();
        }
        setFormMode(value);
    }

    function handleTitleChange(e) {
        setTitle(e.target.value);
        setTitleValidationError(false);
    }

    function handleSubscribeChange(e) {
        if (e.target.checked) {
            setNotifyType("EMAIL");
        } else {
            setNotifyType("NONE");
        }
    }

    function handleDurationChange(e) {
        setDuration(parseInt(e.target.value, 10));
    }

    return (
        <form onSubmit={handleFormSubmit}>
            {defaultFormMode === FormModes.UPDATE_QUERY_ONLY && existingSavedSearch && (
                <Fieldset
                    legend={`Ønsker du å lagre endringene for ${existingSavedSearch.title} eller lagre et nytt søk?`}
                >
                    <Radio
                        label="Lagre endringene"
                        name="add_or_replace"
                        value={FormModes.UPDATE_QUERY_ONLY}
                        onChange={handleFormModeChange}
                        checked={formMode === FormModes.UPDATE_QUERY_ONLY}
                    />
                    <Radio
                        label="Lagre nytt søk"
                        name="add_or_replace"
                        value={FormModes.ADD}
                        onChange={handleFormModeChange}
                        checked={formMode === FormModes.ADD}
                    />
                </Fieldset>
            )}

            {shouldShowForm && (
                <React.Fragment>
                    <Input
                        id="SavedSearchModal__name"
                        className="SavedSearchModal__body__name"
                        label="Navn*"
                        onChange={handleTitleChange}
                        value={title}
                        feil={titleValidationError ? { feilmelding: titleValidationError } : undefined}
                        inputRef={(el) => {
                            titleRef = el;
                        }}
                    />
                    <Checkbox
                        className="SavedSearchModal__body__notify"
                        label="Ja, jeg ønsker å motta e-post med varsel om nye treff"
                        onChange={handleSubscribeChange}
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
                                        onChange={handleDurationChange}
                                        checked={duration === 30}
                                    />
                                    <Radio
                                        label="60 dager"
                                        className="SavedSearchModal__body__duration"
                                        name="duration"
                                        value="60"
                                        onChange={handleDurationChange}
                                        checked={duration === 60}
                                    />
                                    <Radio
                                        label="90 dager"
                                        className="SavedSearchModal__body__duration"
                                        name="duration"
                                        value="90"
                                        onChange={handleDurationChange}
                                        checked={duration === 90}
                                    />
                                </Fieldset>
                            </SkjemaGruppe>
                            {!isStringEmpty(user.data.email) && (
                                <p className="SavedSearches__p">
                                    Varsel sendes på e-post. Gå til{" "}
                                    <a href="/personinnstillinger" className="link">
                                        Innstillinger
                                    </a>{" "}
                                    for å endre e-postadresse.
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
                    Lagre søk
                </Hovedknapp>
                <Knapp htmlType="button" onClick={onClose}>
                    Avbryt
                </Knapp>
            </div>
        </form>
    );
}

export default SaveSearchForm;
