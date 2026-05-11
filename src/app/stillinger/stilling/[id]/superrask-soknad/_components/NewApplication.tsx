"use client";

import { PageBlock } from "@navikt/ds-react/Page";
import { type FormEvent, useState } from "react";
import type { AdDTO } from "@/app/stillinger/_common/lib/ad-model";
import type { ApplicationForm } from "@/app/stillinger/stilling/[id]/superrask-soknad/_types/Application";
import type { ValidationErrors } from "@/app/stillinger/stilling/[id]/superrask-soknad/_types/ValidationErrors";
import AdDetailsHeader from "./AdDetailsHeader";
import Form from "./Form";
import Success from "./Success";

interface NewApplicationProps {
    ad: AdDTO;
    applicationForm: ApplicationForm;
    submitApplication: (formData: FormData) => Promise<State>;
}

export interface State {
    validationErrors: ValidationErrors;
    success: boolean;
    error?: string;
    data?: {
        email: string;
        applicationId?: string;
    };
}

export default function NewApplication({ ad, applicationForm, submitApplication }: NewApplicationProps) {
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
        } catch {
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
            <PageBlock width="text" gutters>
                {state.success && state.data ? (
                    <Success email={state.data.email} applicationId={state.data.applicationId} />
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
            </PageBlock>
        </div>
    );
}
