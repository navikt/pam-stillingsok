import React from "react";
import { BodyLong, Button, Heading } from "@navikt/ds-react";
import PropTypes from "prop-types";
import Link from "next/link";
import { CONTEXT_PATH } from "../../../../../_common/environment";
import GiveFeedback from "./GiveFeedback";
import H1WithAutoFocus from "../../../../../_common/components/h1WithAutoFocus/H1WithAutoFocus";
import useScrollToTop from "../../../../../_common/hooks/useScrollToTop";

function Success({ email }) {
    useScrollToTop();

    return (
        <>
            <H1WithAutoFocus size="large">Din søknad er sendt til bedriften</H1WithAutoFocus>
            <BodyLong spacing>
                Du vil straks få en bekreftelse på din e-post {email}. Ønsker du å trekke din søknad finner du
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

            <GiveFeedback />
        </>
    );
}

Success.propTypes = {
    email: PropTypes.string,
};

export default Success;
