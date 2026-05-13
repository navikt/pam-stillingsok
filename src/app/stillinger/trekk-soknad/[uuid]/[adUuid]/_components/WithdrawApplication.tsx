"use client";

import { PageBlock } from "@navikt/ds-react/Page";
import { useActionState } from "react";
import type { AdDTO } from "@/app/stillinger/_common/lib/ad-model";
import WithdrawApplicationConfirmationRequired from "@/app/stillinger/trekk-soknad/[uuid]/[adUuid]/_components/WithdrawApplicationConfirmationRequired";
import WithdrawApplicationSuccess from "@/app/stillinger/trekk-soknad/[uuid]/[adUuid]/_components/WithdrawApplicationSuccess";
import type { WithdrawResponse } from "@/app/stillinger/trekk-soknad/[uuid]/[adUuid]/_types/Responses";

type WithdrawApplicationProps = {
    onWithdrawApplication: () => Promise<WithdrawResponse>;
    stilling: AdDTO;
};

function WithdrawApplication({ stilling, onWithdrawApplication }: WithdrawApplicationProps) {
    const [state, formAction] = useActionState(onWithdrawApplication, { success: false });
    return (
        <PageBlock as="section" width="md" gutters className="mt-10 mb-24">
            {!state.success ? (
                <WithdrawApplicationConfirmationRequired
                    onWithdrawApplication={formAction}
                    error={state.error}
                    stilling={stilling}
                />
            ) : (
                <WithdrawApplicationSuccess />
            )}
        </PageBlock>
    );
}

export default WithdrawApplication;
