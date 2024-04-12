"use client";

import React from "react";
import { useFormState } from "react-dom";
import PropTypes from "prop-types";
import WithdrawApplicationSuccess from "./WithdrawApplicationSuccess";
import WithdrawApplicationConfirmationRequired from "./WithdrawApplicationConfirmationRequired";

function WithdrawApplication({ ad, withdrawApplication }) {
    const [state, formAction] = useFormState(withdrawApplication, { success: false });

    return (
        <div className="container-small mt-10 mb-24">
            {!state.success ? (
                <WithdrawApplicationConfirmationRequired
                    submitForm={formAction}
                    isDeleting={false}
                    hasError={state.error}
                    ad={ad}
                />
            ) : (
                <WithdrawApplicationSuccess />
            )}
        </div>
    );
}

WithdrawApplication.propTypes = {
    withdrawApplication: PropTypes.func.isRequired,
    ad: PropTypes.shape({}),
};

export default WithdrawApplication;
