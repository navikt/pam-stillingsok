"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";
import WithdrawApplicationSuccess from "./WithdrawApplicationSuccess";
import WithdrawApplicationConfirmationRequired from "./WithdrawApplicationConfirmationRequired";

function WithdrawApplication({ ad, withdrawApplication }) {
    const [state, setState] = useState({ success: false, error: undefined });
    const [isPending, setIsPending] = useState(false);

    const onWithdrawApplicationClick = async (e) => {
        let result, fetchSuccess;

        setIsPending(true);

        try {
            result = await withdrawApplication();
            fetchSuccess = true;
        } catch (err) {
            fetchSuccess = false;
        }

        if (fetchSuccess) {
            setState(result);
        } else {
            setState({
                success: false,
                error: "unknown",
            });
        }
        setIsPending(false);
    };

    return (
        <div className="container-small mt-12 mb-12">
            {!state.success ? (
                <WithdrawApplicationConfirmationRequired
                    onWithdrawApplicationClick={onWithdrawApplicationClick}
                    isPending={isPending}
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
