import React from "react";
import { BodyLong, Button } from "@navikt/ds-react";
import Link from "../../../../../../migrating/Link";
import { CONTEXT_PATH } from "../../../../../../modules/common/environment";
import H1WithAutoFocus from "../../../../../../modules/common/components/h1WithAutoFocus/H1WithAutoFocus";
import GiveFeedback from "../../../../stilling/[id]/superrask-soknad/_components/GiveFeedback";

function WithdrawApplicationSuccess() {
    return (
        <>
            <H1WithAutoFocus level="1" size="large">
                Din søknad er nå trukket
            </H1WithAutoFocus>
            <BodyLong className="mb-10">
                Informasjonen du oppgav i din søknad er slettet. Dersom du angrer på at du trakk søknaden, kan du søke
                på nytt.
            </BodyLong>
            <Button variant="secondary" as={Link} to={CONTEXT_PATH}>
                Se ledige stillinger
            </Button>

            <GiveFeedback />
        </>
    );
}

export default WithdrawApplicationSuccess;
