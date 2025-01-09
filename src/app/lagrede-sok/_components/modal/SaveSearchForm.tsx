"use client";

import React, { FormEvent, MutableRefObject, ReactElement, useContext, useRef, useState, useTransition } from "react";
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
import { UserContext, UserContextProps } from "@/app/_common/user/UserProvider";
import useToggle from "@/app/_common/hooks/useToggle";
import { isStringEmpty } from "@/app/_common/utils/utils";
import * as actions from "@/app/_common/actions";
import { SavedSearch } from "@/app/_common/actions/savedSearchActions";
import { ActionResponse } from "@/app/_common/actions/types";

export const FormModes = {
    ADD: "ADD",
    UPDATE: "UPDATE",
    UPDATE_QUERY_ONLY: "UPDATE_QUERY_ONLY",
};

interface SaveSearchFormProps {
    existingSavedSearch: SavedSearch | undefined;
    onClose: () => void;
    onSuccess: (response: SavedSearch) => void;
    formData: SaveSearchFormData;
    defaultFormMode?: string;
}

export interface SaveSearchFormData {
    searchQuery?: string;
    duration?: number;
    notifyType?: string;
    title?: string;
}

/**
 * Form for creating or updating a saved search.
 */
function SaveSearchForm({
    existingSavedSearch,
    onClose,
    onSuccess,
    formData,
    defaultFormMode,
}: SaveSearchFormProps): ReactElement {
    const [isPending, startTransition] = useTransition();
    const [showError, setShowError] = useState(false);

    const { user } = useContext<UserContextProps>(UserContext);

    // Form modes
    const [formMode, setFormMode] = useState(defaultFormMode);
    const [shouldShowForm, showForm, hideForm] = useToggle(defaultFormMode !== FormModes.UPDATE_QUERY_ONLY);

    // Form data
    const [title, setTitle] = useState(formData.title);
    const [notifyType, setNotifyType] = useState(formData.notifyType ? formData.notifyType : "NONE");
    const [duration, setDuration] = useState(formData.duration ? formData.duration : 30);

    // Validation
    const [titleValidationError, setTitleValidationError] = useState<string | undefined>(undefined);

    const titleRef = useRef<HTMLInputElement>();

    function validateForm(): boolean {
        let isValid = true;

        if ((formMode === FormModes.ADD || formMode === FormModes.UPDATE) && title?.trim().length === 0) {
            isValid = false;
            setTitleValidationError("Navn på søk mangler");
            if (titleRef.current) {
                titleRef.current.focus();
            }
        } else {
            setTitleValidationError(undefined);
        }

        return isValid;
    }

    function handleFormSubmit(e: FormEvent): void {
        e.preventDefault();
        if (validateForm()) {
            const newExpiresDate = new Date();
            newExpiresDate.setDate(new Date().getDate() + duration);

            let dataToBeSaved: SavedSearch = {
                title,
                notifyType,
                expires: newExpiresDate.toISOString(),
                duration: notifyType === "NONE" ? 0 : duration,
                status: notifyType === "NONE" ? "INACTIVE" : "ACTIVE",
                searchQuery: formData.searchQuery,
            };

            if (formMode === FormModes.ADD) {
                startTransition(async () => {
                    setShowError(false);
                    let isSuccess;
                    let result: ActionResponse<SavedSearch>;
                    try {
                        result = await actions.saveSavedSearchAction(dataToBeSaved);
                        isSuccess = result.success;
                    } catch (err) {
                        isSuccess = false;
                    }
                    if (isSuccess) {
                        onSuccess(result!.data!);
                    } else {
                        setShowError(true);
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
                    let isSuccess;
                    let result: ActionResponse<SavedSearch>;
                    try {
                        result = await actions.updateSavedSearchAction(dataToBeSaved);
                        isSuccess = result.success;
                    } catch (err) {
                        isSuccess = false;
                    }
                    if (isSuccess) {
                        onSuccess(result!.data!);
                    } else {
                        setShowError(true);
                    }
                });
            }
        }
    }

    function handleFormModeChange(value: string): void {
        if (value === FormModes.ADD) {
            showForm();
        } else {
            hideForm();
        }
        setFormMode(value);
    }

    function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        setTitle(e.target.value);
        setTitleValidationError(undefined);
    }

    function handleSubscribeChange(e: React.ChangeEvent<HTMLInputElement>): void {
        if (e.target.checked) {
            setNotifyType("EMAIL");
        } else {
            setNotifyType("NONE");
        }
    }

    function handleDurationChange(value: number): void {
        setDuration(value);
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
                            label="Navn"
                            description="Må fylles ut"
                            onChange={handleTitleChange}
                            value={title}
                            error={titleValidationError}
                            ref={titleRef as MutableRefObject<HTMLInputElement>}
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
                                {!isStringEmpty(user?.email) && (
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

export default SaveSearchForm;
