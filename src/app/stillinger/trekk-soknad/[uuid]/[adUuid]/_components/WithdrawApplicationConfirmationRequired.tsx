import { BodyLong, BodyShort, Button, Heading, HStack, Label } from "@navikt/ds-react";
import Link from "next/link";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import ApiErrorMessage from "@/app/stillinger/_common/components/ApiErrorMessage";
import type { AdDTO } from "@/app/stillinger/_common/lib/ad-model";
import { WithdrawButton } from "@/app/stillinger/trekk-soknad/[uuid]/[adUuid]/_components/WithdrawButton";

type Props = {
    stilling: AdDTO;
    onWithdrawApplication: () => void;
    from?: string;
    error: string | undefined;
};

function WithdrawApplicationConfirmationRequired({ stilling, onWithdrawApplication, from, error }: Props) {
    const fromMineSoknader = from === "mine-soknader";

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
                        <AkselNextLink href={`/stillinger/stilling/${stilling.id}`}>{stilling.title}</AkselNextLink>
                    </BodyShort>
                    <Label as="p">{stilling.employer?.name}</Label>
                </div>
            )}

            {error != null && <ApiErrorMessage apiErrorCode={error} errorHeading="Søknaden ble ikke trukket" />}

            <HStack gap="space-16" align="center">
                <form action={onWithdrawApplication}>
                    <WithdrawButton />
                </form>
                {fromMineSoknader && (
                    <Button variant="secondary" as={Link} prefetch={false} href="/superrask-soknad/mine-soknader">
                        Avbryt
                    </Button>
                )}
            </HStack>
        </>
    );
}

export default WithdrawApplicationConfirmationRequired;
