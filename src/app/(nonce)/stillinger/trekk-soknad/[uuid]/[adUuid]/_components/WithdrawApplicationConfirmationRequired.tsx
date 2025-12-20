import React, { ReactElement } from "react";
import { BodyLong, BodyShort, Heading, Label } from "@navikt/ds-react";
import ApiErrorMessage from "@/app/(nonce)/stillinger/_common/components/ApiErrorMessage";
import { WithdrawButton } from "@/app/(nonce)/stillinger/trekk-soknad/[uuid]/[adUuid]/_components/WithdrawButton";
import { type AdDTO } from "@/app/(nonce)/stillinger/_common/lib/ad-model";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";

type Props = {
    stilling: AdDTO;
    onWithdrawApplication: () => void;
    error: string | undefined;
};

function WithdrawApplicationConfirmationRequired({ stilling, onWithdrawApplication, error }: Props): ReactElement {
    return (
        <>
            <Heading level="1" size="large" spacing>
                Bekreft at du ønsker å trekke din søknad
            </Heading>
            <BodyLong className="mb-8">
                Informasjonen du har oppgitt i din søknad vil bli slettet. Dette valget kan ikke angres og du må søke på
                nytt dersom du ønsker det.
            </BodyLong>
            {stilling && (
                <div className="mb-8">
                    <BodyShort>
                        <AkselNextLink href={`/src/app/(nonce)/stillinger/stilling/${stilling.id}`}>
                            {stilling.title}
                        </AkselNextLink>
                    </BodyShort>
                    <Label as="p">{stilling.employer?.name}</Label>
                </div>
            )}

            {error != null && <ApiErrorMessage apiErrorCode={error} errorHeading="Søknaden ble ikke trukket" />}

            <form action={onWithdrawApplication}>
                <WithdrawButton />
            </form>
        </>
    );
}

export default WithdrawApplicationConfirmationRequired;
