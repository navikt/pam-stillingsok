"use client";

import React, { FormEvent, ReactElement, useState } from "react";
import { ApplicationForm } from "@/app/stilling/[id]/superrask-soknad/_types/Application";
import { StillingDetaljer } from "@/app/lib/stillingSchema";
import { ValidationErrors } from "@/app/stilling/[id]/superrask-soknad/_types/ValidationErrors";
import Success from "./Success";
import Form from "./Form";
import AdDetailsHeader from "./AdDetailsHeader";

interface NewApplicationProps {
    ad: StillingDetaljer;
    applicationForm: ApplicationForm;
    submitApplication: (formData: FormData) => Promise<State>;
}

export interface State {
    validationErrors: ValidationErrors;
    success: boolean;
    error?: string;
    data?: {
        email: string;
    };
}

export default function NewApplication({ ad, applicationForm, submitApplication }: NewApplicationProps): ReactElement {
    const [state, setState] = useState<State>({ validationErrors: {}, success: false, error: undefined });
    const [isPending, setIsPending] = useState(false);

    const onSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();

        let result: State = { validationErrors: {}, success: false };
        let fetchSuccess: boolean;
        const formData = new FormData(e.target as HTMLFormElement);

        setIsPending(true);

        try {
            result = await submitApplication(formData);
            fetchSuccess = true;
        } catch (err) {
            fetchSuccess = false;
        }

        if (fetchSuccess) {
            setState(result);
        } else {
            setState((prevState) => ({
                ...prevState,
                error: "offline",
            }));
        }
        setIsPending(false);
    };

    return (
        <div className="mb-16">
            <AdDetailsHeader source={ad} />
            <div className="container-small">
                {state.success && state.data ? (
                    <Success email={state.data.email} />
                ) : (
                    <Form
                        ad={ad}
                        applicationForm={applicationForm}
                        onSubmit={onSubmit}
                        error={state.error}
                        validationErrors={state.validationErrors}
                        isPending={isPending}
                    />
                )}
            </div>
        </div>
    );
}
