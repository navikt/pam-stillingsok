"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";
import Success from "./Success";
import Form from "./Form";
import AdDetailsHeader from "./AdDetailsHeader";
import logAmplitudeEvent from "@/app/_common/monitoring/amplitude";

export default function NewApplication({ ad, applicationForm, submitApplication }) {
    const [state, setState] = useState({ validationErrors: {}, success: false, error: false });
    const [isPending, setIsPending] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();

        let result, fetchSuccess;
        const formData = new FormData(e.target);

        setIsPending(true);

        try {
            result = await submitApplication(formData);
            fetchSuccess = true;
        } catch (err) {
            fetchSuccess = false;
        }

        if (fetchSuccess) {
            setState(result);

            if (result?.success) {
                logAmplitudeEvent("submit superrask søknad");
            }
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
            <AdDetailsHeader source={ad._source} />
            <div className="container-small">
                {state.success ? (
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

NewApplication.propTypes = {
    ad: PropTypes.shape({
        _id: PropTypes.string,
        _source: PropTypes.shape({
            title: PropTypes.string,
        }),
    }),
    applicationForm: PropTypes.shape({}),
    submitApplication: PropTypes.func.isRequired,
};
