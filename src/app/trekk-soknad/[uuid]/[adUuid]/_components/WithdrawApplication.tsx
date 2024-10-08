"use client";

import React, { ReactElement } from "react";
import { useFormState } from "react-dom";
import WithdrawApplicationConfirmationRequired from "@/app/trekk-soknad/[uuid]/[adUuid]/_components/WithdrawApplicationConfirmationRequired";
import WithdrawApplicationSuccess from "@/app/trekk-soknad/[uuid]/[adUuid]/_components/WithdrawApplicationSuccess";
import { JobAdvertisment, WithdrawResponse } from "@/app/trekk-soknad/[uuid]/[adUuid]/_types/Responses";

type WithdrawApplicationProps = {
    onWithdrawApplication: () => Promise<WithdrawResponse>;
    jobAdvertisement: JobAdvertisment;
};

function WithdrawApplication({ jobAdvertisement, onWithdrawApplication }: WithdrawApplicationProps): ReactElement {
    const [state, formAction] = useFormState(onWithdrawApplication, { success: false });
    return (
        <div className="container-small mt-10 mb-24">
            {!state.success ? (
                <WithdrawApplicationConfirmationRequired
                    onWithdrawApplication={formAction}
                    error={state.error}
                    jobAdvertisement={jobAdvertisement}
                />
            ) : (
                <WithdrawApplicationSuccess />
            )}
        </div>
    );
}

export default WithdrawApplication;
