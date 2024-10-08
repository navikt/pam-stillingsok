import React, { ReactElement } from "react";
import { BodyLong, Button, Heading } from "@navikt/ds-react";
import Link from "next/link";
import GiveFeedback from "@/app/stilling/[id]/superrask-soknad/_components/GiveFeedback";

function WithdrawApplicationSuccess(): ReactElement {
    return (
        <>
            <Heading level="1" size="large" spacing tabIndex={-1} aria-live="polite" role="alert">
                Din søknad er nå trukket
            </Heading>

            <BodyLong className="mb-10">
                Informasjonen du oppgav i din søknad er slettet. Dersom du angrer på at du trakk søknaden, kan du søke
                på nytt.
            </BodyLong>
            <Button variant="secondary" as={Link} href="/">
                Se ledige stillinger
            </Button>

            <GiveFeedback />
        </>
    );
}

export default WithdrawApplicationSuccess;
