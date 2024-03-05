"use client";

import React, { useContext, useRef, useState, useTransition } from "react";
import {
    Alert,
    BodyLong,
    Button,
    Checkbox,
    Radio,
    RadioGroup,
    TextField,
    Link as AkselLink,
    Modal,
} from "@navikt/ds-react";
import PropTypes from "prop-types";
import { UserContext } from "@/app/_common/user/UserProvider";
import useToggle from "@/app/_common/hooks/useToggle";
import { isStringEmpty } from "@/app/_common/utils/utils";
import * as actions from "@/app/_common/actions";

export const FormModes = {
    ADD: "ADD",
    UPDATE: "UPDATE",
    UPDATE_QUERY_ONLY: "UPDATE_QUERY_ONLY",
};

/**
 * Form for creating or updating a saved search.
 */
function SaveSearchForm({ existingSavedSearch, onClose, onSuccess, formData, defaultFormMode }) {
    const [isPending, startTransition] = useTransition();
    const [showError, setShowError] = useState(false);

    const { user } = useContext(UserContext);

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

    function handleFormSubmit(e) {
        e.preventDefault();
        if (validateForm()) {
            let dataToBeSaved = {
                title,
                notifyType,
                duration: notifyType === "NONE" ? 0 : duration,
                status: notifyType === "NONE" ? "INACTIVE" : "ACTIVE",
                searchQuery: formData.searchQuery,
            };

            if (formMode === FormModes.ADD) {
                startTransition(async () => {
                    setShowError(false);
                    const { success, data } = await actions.saveSavedSearchAction(dataToBeSaved);
                    if (!success) {
                        setShowError(true);
                    } else {
                        onSuccess(data);
                    }
                });
            } else {
                if (formMode === FormModes.UPDATE) {
                    dataToBeSaved = {
                        ...existingSavedSearch,
                        ...dataToBeSaved,
                    };
                } else if (formMode === FormModes.UPDATE_QUERY_ONLY) {
                    dataToBeSaved = {
                        ...existingSavedSearch,
                        searchQuery: formData.searchQuery,
                    };
                }
                startTransition(async () => {
                    setShowError(false);
                    const { success, data } = await actions.updateSavedSearchAction(dataToBeSaved);
                    if (!success) {
                        setShowError(true);
                    } else {
                        onSuccess(data);
                    }
                });
            }
        }
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
            <Modal.Body>
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
                    <>
                        <TextField
                            id="SavedSearchModal__name"
                            className="mb-6"
                            label="Navn*"
                            onChange={handleTitleChange}
                            value={title}
                            error={titleValidationError}
                            ref={titleRef}
                        />
                        <Checkbox className="mb-6" onChange={handleSubscribeChange} checked={notifyType === "EMAIL"}>
                            Ja, jeg ønsker å motta e-post med varsel om nye treff
                        </Checkbox>
                        {notifyType === "EMAIL" && (
                            <>
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
                                {!isStringEmpty(user.email) && (
                                    <BodyLong>
                                        Varsel sendes på e-post. Gå til{" "}
                                        <AkselLink href="/min-side/innstillinger">samtykker og innstillinger</AkselLink>{" "}
                                        for å endre e-postadresse.
                                    </BodyLong>
                                )}
                            </>
                        )}
                    </>
                )}
                {showError && (
                    <Alert variant="error" className="mb-4 mt-4" role="alert">
                        Noe gikk galt ved lagring, forsøk igjen eller last siden på nytt
                    </Alert>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" type="submit" loading={isPending} disabled={isPending}>
                    Lagre søk
                </Button>
                <Button variant="secondary" type="button" onClick={onClose}>
                    Avbryt
                </Button>
            </Modal.Footer>
        </form>
    );
}

SaveSearchForm.propTypes = {
    existingSavedSearch: PropTypes.shape({
        uuid: PropTypes.string,
        title: PropTypes.string,
    }),
    onClose: PropTypes.func,
    onSuccess: PropTypes.func,
    formData: PropTypes.shape({
        searchQuery: PropTypes.string,
        duration: PropTypes.number,
        notifyType: PropTypes.string,
        title: PropTypes.string,
    }),
    defaultFormMode: PropTypes.string,
};

export default SaveSearchForm;
