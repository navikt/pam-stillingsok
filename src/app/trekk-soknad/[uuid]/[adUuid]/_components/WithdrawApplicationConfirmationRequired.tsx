import React, { ReactElement } from "react";
import { BodyLong, BodyShort, Heading, Label, Link as AkselLink } from "@navikt/ds-react";
import Link from "next/link";
import getEmployer from "@/app/_common/utils/getEmployer";
import ApiErrorMessage from "@/app/_common/components/ApiErrorMessage";
import { JobAdvertisment } from "@/app/trekk-soknad/[uuid]/[adUuid]/_types/Responses";
import { WithdrawButton } from "@/app/trekk-soknad/[uuid]/[adUuid]/_components/WithdrawButton";

type Props = {
    jobAdvertisement: JobAdvertisment;
    onWithdrawApplication: () => void;
    error: string | undefined;
};

function WithdrawApplicationConfirmationRequired({
    jobAdvertisement,
    onWithdrawApplication,
    error,
}: Props): ReactElement {
    return (
        <>
            <Heading level="1" size="large" spacing>
                Bekreft at du ønsker å trekke din søknad
            </Heading>
            <BodyLong className="mb-8">
                Informasjonen du har oppgitt i din søknad vil bli slettet. Dette valget kan ikke angres og du må søke på
                nytt dersom du ønsker det.
            </BodyLong>
            {jobAdvertisement && (
                <div className="mb-8">
                    <BodyShort>
                        <AkselLink as={Link} href={`/stilling/${jobAdvertisement._id}`}>
                            {jobAdvertisement._source.title}
                        </AkselLink>
                    </BodyShort>
                    <Label as="p">{getEmployer(jobAdvertisement._source)}</Label>
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
