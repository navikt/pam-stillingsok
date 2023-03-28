import React from "react";
import ScrollToTop from "../../../common/components/ScrollToTop";
import { Link } from "react-router-dom";
import { CONTEXT_PATH } from "../../../common/environment";
import Feedback from "./Feedback";
import { BodyLong, Button, Heading } from "@navikt/ds-react";

function SuperraskSoknadSuccess({ data }) {
    return (
        <ScrollToTop>
            <div className="InterestForm__success-message">
                <Heading level="1" size="xlarge" spacing>
                    Din søknad er sendt til bedriften
                </Heading>
                <BodyLong spacing>
                    Du vil straks få en bekreftelse på din e-post {data.email}. Ønsker du å trekke din søknad finner du
                    informasjon om dette i e-posten.
                </BodyLong>
                <Heading level="2" spacing>
                    Hva skjer nå?
                </Heading>
                <BodyLong className="mb-2">
                    Bedriften vil vurdere din søknad og ta kontakt dersom de syns du passer for jobben. Du får beskjed
                    på e-post så fort bedriften har gjort en vurdering.
                </BodyLong>
                <Button variant="secondary" as={Link} to={CONTEXT_PATH}>
                    Tilbake til stillingssøket
                </Button>
                <Feedback />
            </div>
        </ScrollToTop>
    );
}

export default SuperraskSoknadSuccess;
