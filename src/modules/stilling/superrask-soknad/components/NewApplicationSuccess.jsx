import React from "react";
import Link from "next/link";
import { BodyLong, Button, Heading } from "@navikt/ds-react";
import PropTypes from "prop-types";
import { CONTEXT_PATH } from "../../../common/environment";
import Feedback from "./Feedback";
import H1WithAutoFocus from "../../../common/components/h1WithAutoFocus/H1WithAutoFocus";
import useScrollToTop from "../../../common/hooks/useScrollToTop";

function NewApplicationSuccess({ data }) {
    useScrollToTop();
    return (
        <div className="NewApplicationForm__success-message">
            <H1WithAutoFocus size="large">Din søknad er sendt til bedriften</H1WithAutoFocus>
            <BodyLong spacing>
                Du vil straks få en bekreftelse på din e-post {data.email}. Ønsker du å trekke din søknad finner du
                informasjon om dette i e-posten.
            </BodyLong>
            <Heading level="2" spacing size="medium">
                Hva skjer nå?
            </Heading>
            <BodyLong className="mb-8">
                Bedriften vil vurdere din søknad og ta kontakt dersom de syns du passer for jobben. Du får beskjed på
                e-post så fort bedriften har gjort en vurdering.
            </BodyLong>
            <Button variant="secondary" as={Link} href={CONTEXT_PATH}>
                Tilbake til stillingssøket
            </Button>
            <Feedback />
        </div>
    );
}

NewApplicationSuccess.propTypes = {
    data: PropTypes.shape({ email: PropTypes.string }),
};

export default NewApplicationSuccess;
