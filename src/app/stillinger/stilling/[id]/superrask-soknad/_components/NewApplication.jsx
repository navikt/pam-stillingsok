"use client";

import React from "react";
import { useFormState } from "react-dom";
import PropTypes from "prop-types";
import Success from "./Success";
import Form from "./Form";
import AdDetailsHeader from "./AdDetailsHeader";

function NewApplication({ ad, submitApplication }) {
    // eslint-disable-next-line no-unused-vars
    const [state, formAction] = useFormState(submitApplication, { validationErrors: {}, success: false });
    const applicationForm = "todo";
    const submitForm = "todo";

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
                        submitForm={submitForm}
                        pending={state.pending}
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
    submitApplication: PropTypes.func.isRequired,
};

export default NewApplication;
