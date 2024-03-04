import React, { useEffect } from "react";
import { BodyLong, Button, Heading } from "@navikt/ds-react";
import PropTypes from "prop-types";
import Link from "next/link";
import GiveFeedback from "./GiveFeedback";

function Success({ email }) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <Heading level="1" size="large" spacing>
                Din søknad er sendt til bedriften
            </Heading>
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
            <Button variant="secondary" as={Link} href="/">
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
