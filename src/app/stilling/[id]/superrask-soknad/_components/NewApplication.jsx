"use client";

import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import PropTypes from "prop-types";
import Success from "./Success";
import Form from "./Form";
import AdDetailsHeader from "./AdDetailsHeader";
import logAmplitudeEvent from "@/app/_common/monitoring/amplitude";

function useNetwork() {
    const [isOnline, setNetwork] = useState(true);
    useEffect(() => {
        if (window) {
            window.addEventListener("offline", () => setNetwork(window.navigator.onLine));
            window.addEventListener("online", () => setNetwork(window.navigator.onLine));
        }
    });
    return isOnline;
}
export default function NewApplication({ ad, applicationForm, submitApplication }) {
    const [state, formAction] = useFormState(submitApplication, { validationErrors: {}, success: false });
    const [submitOffline, setSubmitOffline] = useState(false);
    const isOnline = useNetwork();

    useEffect(() => {
        if (state && state.success) {
            try {
                logAmplitudeEvent("submit superrask søknad");
            } catch (err) {
                // ignore
            }
        }
    }, [state]);

    return (
        <div className="mb-24">
            <AdDetailsHeader source={ad._source} />
            <div className="container-small">
                {state.success ? (
                    <Success email={state.data.email} />
                ) : (
                    <Form
                        ad={ad}
                        applicationForm={applicationForm}
                        submitApplication={(e) => {
                            if (isOnline) {
                                setSubmitOffline(false);
                                formAction(e);
                            } else {
                                setSubmitOffline(true);
                            }
                        }}
                        submitApiError={state.error}
                        offlineError={submitOffline}
                        validationErrors={state.validationErrors}
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
