import React from "react";
import { Link } from "react-router-dom";
import { CONTEXT_PATH } from "../../../common/environment";
import Feedback from "./Feedback";
import { BodyLong, Button, Heading } from "@navikt/ds-react";

function TrekkSoknadSuccess() {
    return (
        <React.Fragment>
            <Heading level="1" size="xlarge" spacing aria-live="polite" role="alert">
                Din søknad er nå trukket
            </Heading>
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
