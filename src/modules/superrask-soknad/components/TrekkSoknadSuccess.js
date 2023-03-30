import React from "react";
import { Link } from "react-router-dom";
import { CONTEXT_PATH } from "../../../common/environment";
import Feedback from "./Feedback";
import { BodyLong, Button } from "@navikt/ds-react";
import H1WithAutoFocus from "../../../common/components/h1WithAutoFocus/H1WithAutoFocus";

function TrekkSoknadSuccess() {
    return (
        <React.Fragment>
            <H1WithAutoFocus level="1" size="large">
                Din søknad er nå trukket
            </H1WithAutoFocus>
            <BodyLong className="mb-2_5">
                Informasjonen du oppgav i din søknad er slettet. Dersom du angrer på at du trakk søknaden, kan du søke
                på nytt.
            </BodyLong>
            <Button variant="secondary" as={Link} to={CONTEXT_PATH}>
                Se ledige stillinger
            </Button>

            <Feedback />
        </React.Fragment>
    );
}

export default TrekkSoknadSuccess;
