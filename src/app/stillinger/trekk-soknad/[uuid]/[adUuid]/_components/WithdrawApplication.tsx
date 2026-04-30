"use client";

import React, { useActionState } from "react";
import WithdrawApplicationConfirmationRequired from "@/app/stillinger/trekk-soknad/[uuid]/[adUuid]/_components/WithdrawApplicationConfirmationRequired";
import WithdrawApplicationSuccess from "@/app/stillinger/trekk-soknad/[uuid]/[adUuid]/_components/WithdrawApplicationSuccess";
import { WithdrawResponse } from "@/app/stillinger/trekk-soknad/[uuid]/[adUuid]/_types/Responses";
import { type AdDTO } from "@/app/stillinger/_common/lib/ad-model";
import { PageBlock } from "@navikt/ds-react/Page";

type WithdrawApplicationProps = {
    onWithdrawApplication: () => Promise<WithdrawResponse>;
    stilling: AdDTO;
    from?: string;
};

function WithdrawApplication({ stilling, onWithdrawApplication, from }: WithdrawApplicationProps) {
    const [state, formAction] = useActionState(onWithdrawApplication, { success: false });
    return (
        <PageBlock as="section" width="md" gutters className="mt-10 mb-24">
            {!state.success ? (
                <WithdrawApplicationConfirmationRequired
                    onWithdrawApplication={formAction}
                    from={from}
                    error={state.error}
                    stilling={stilling}
                />
            ) : (
                <WithdrawApplicationSuccess from={from} />
            )}
        </PageBlock>
    );
}

export default WithdrawApplication;
