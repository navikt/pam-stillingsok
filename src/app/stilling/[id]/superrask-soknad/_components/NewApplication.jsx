"use client";

import React from "react";
import { useFormState } from "react-dom";
import PropTypes from "prop-types";
import Success from "./Success";
import Form from "./Form";
import AdDetailsHeader from "./AdDetailsHeader";

export default function NewApplication({ ad, applicationForm, submitApplication }) {
    const [state, formAction] = useFormState(submitApplication, { validationErrors: {}, success: false });

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
                        submitApplication={formAction}
                        submitApiError={state.error}
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
