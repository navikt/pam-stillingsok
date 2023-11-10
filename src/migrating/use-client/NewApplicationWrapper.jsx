"use client";

import React from "react";
import { useFormState } from "react-dom";
import PropTypes from "prop-types";
import NewApplication from "../../modules/stilling/superrask-soknad/components/NewApplication";

function NewApplicationWrapper(props) {
    const { submitApplication, ...rest } = props;
    const [state, formAction] = useFormState(submitApplication, { validationErrors: {}, success: false });

    return <NewApplication {...rest} formAction={formAction} submitFormState={state} />;
}

NewApplicationWrapper.propTypes = {
    submitApplication: PropTypes.func.isRequired,
};

export default NewApplicationWrapper;
