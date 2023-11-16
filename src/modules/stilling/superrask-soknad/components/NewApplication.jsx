import React from "react";
import PropTypes from "prop-types";
import Success from "./Success";
import Form from "./Form";
import AdDetailsHeader from "./AdDetailsHeader";

function NewApplication({ submitForm, ad, applicationForm, submitFormState }) {
    return (
        <div className="mb-16">
            <AdDetailsHeader source={ad._source} />
            <div className="container-small">
                {submitFormState.success ? (
                    <Success email={submitFormState.data.email} />
                ) : (
                    <Form
                        ad={ad}
                        applicationForm={applicationForm}
                        submitForm={submitForm}
                        pending={submitFormState.pending}
                        submitApiError={submitFormState.error}
                        validationErrors={submitFormState.validationErrors}
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
    submitForm: PropTypes.func,
    submitFormState: PropTypes.shape({
        success: PropTypes.bool,
        pending: PropTypes.bool,
        error: PropTypes.string,
        validationErrors: PropTypes.shape({}),
        data: PropTypes.shape({
            email: PropTypes.string,
        }),
    }),
};

export default NewApplication;
