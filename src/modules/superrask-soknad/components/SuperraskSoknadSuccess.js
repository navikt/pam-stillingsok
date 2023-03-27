import React from "react";
import ScrollToTop from "../../../common/components/ScrollToTop";
import { Link } from "react-router-dom";
import { CONTEXT_PATH } from "../../../common/environment";
import Feedback from "./Feedback";
import { Button } from "@navikt/ds-react";

function SuperraskSoknadSuccess({ data }) {
    return (
        <ScrollToTop>
            <div className="InterestForm__success-message">
                <h1 className="InterestForm__h1">Din søknad er sendt til bedriften</h1>
                <p className="InterestForm__p InterestForm__mb-2">
                    Du vil straks få en bekreftelse på din e-post {data.email}. Ønsker du å trekke din søknad finner du
                    informasjon om dette i e-posten.
                </p>
                <h2 className="InterestForm__h2">Hva skjer nå?</h2>
                <p className="InterestForm__p InterestForm__mb-2">
                    Bedriften vil vurdere din søknad og ta kontakt dersom de syns du passer for jobben. Du får beskjed
                    på e-post så fort bedriften har gjort en vurdering.
                </p>
                <Button variant="secondary" as={Link} to={CONTEXT_PATH}>
                    Tilbake til stillingssøket
                </Button>
                <Feedback />
            </div>
        </ScrollToTop>
    );
}

export default SuperraskSoknadSuccess;
