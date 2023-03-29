import React, { useContext, useRef, useState } from "react";
import { UserContext } from "../../../user/contexts/UserProvider";
import { BodyLong, Button, Checkbox, Radio, RadioGroup, TextField, Link as AkselLink } from "@navikt/ds-react";
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

    const titleRef = useRef();

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
                    .catch(() => {
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
            if (titleRef.current) {
                titleRef.current.focus();
            }
        } else {
            setTitleValidationError(undefined);
        }

        return isValid;
    }

    function handleFormModeChange(value) {
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

    function handleDurationChange(value) {
        setDuration(value, 10);
    }

    return (
        <form onSubmit={handleFormSubmit}>
            {defaultFormMode === FormModes.UPDATE_QUERY_ONLY && existingSavedSearch && (
                <RadioGroup
                    legend={`Ønsker du å lagre endringene for ${existingSavedSearch.title} eller lagre et nytt søk?`}
                    onChange={handleFormModeChange}
                    name="add_or_replace"
                    value={formMode}
                >
                    <Radio value={FormModes.UPDATE_QUERY_ONLY}>Lagre endringene</Radio>
                    <Radio value={FormModes.ADD}>Lagre nytt søk</Radio>
                </RadioGroup>
            )}

            {shouldShowForm && (
                <React.Fragment>
                    <TextField
                        id="SavedSearchModal__name"
                        className="SavedSearchModal__body__name"
                        label="Navn*"
                        onChange={handleTitleChange}
                        value={title}
                        error={titleValidationError}
                        ref={titleRef}
                    />
                    <Checkbox
                        className="SavedSearchModal__body__notify"
                        onChange={handleSubscribeChange}
                        checked={notifyType === "EMAIL"}
                    >
                        Ja, jeg ønsker å motta e-post med varsel om nye treff
                    </Checkbox>
                    {notifyType === "EMAIL" && (
                        <React.Fragment>
                            <RadioGroup
                                legend="Varighet på varsel"
                                onChange={handleDurationChange}
                                name="duration"
                                value={duration}
                            >
                                <Radio value={30}>30 dager</Radio>
                                <Radio value={60}>60 dager</Radio>
                                <Radio value={90}>90 dager</Radio>
                            </RadioGroup>
                            {!isStringEmpty(user.data.email) && (
                                <BodyLong>
                                    Varsel sendes på e-post. Gå til{" "}
                                    <AkselLink href="/personinnstillinger">Innstillinger</AkselLink> for å endre
                                    e-postadresse.
                                </BodyLong>
                            )}
                        </React.Fragment>
                    )}
                </React.Fragment>
            )}
            {saveStatus === FetchStatus.FAILURE && (
                <Alert>Noe gikk galt ved lagring, forsøk igjen eller last siden på nytt</Alert>
            )}
            <div className="SaveSearchForm__buttons">
                <Button
                    variant="primary"
                    type="submit"
                    loading={saveStatus === FetchStatus.IS_FETCHING}
                    disabled={saveStatus === FetchStatus.IS_FETCHING}
                >
                    Lagre søk
                </Button>
                <Button variant="secondary" type="button" onClick={onClose}>
                    Avbryt
                </Button>
            </div>
        </form>
    );
}

export default SaveSearchForm;
