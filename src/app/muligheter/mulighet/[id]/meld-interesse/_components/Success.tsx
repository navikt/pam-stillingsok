import React, { ReactElement, useEffect, useRef } from "react";
import { BodyLong, Button, Heading } from "@navikt/ds-react";
import Link from "next/link";
import GiveFeedback from "./GiveFeedback";

function Success(): ReactElement {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (ref.current) {
            ref.current.focus();
        }
    }, []);

    return (
        <>
            <Heading level="1" size="large" spacing ref={ref} tabIndex={-1} aria-live="polite" role="alert">
                Din veileder har nå fått din interesse!
            </Heading>
            <BodyLong spacing>
                Du vil straks få en bekreftelse på din e-post [MAIL]. Ønsker du å trekke din søknad finner du
                informasjon om dette i e-posten.
            </BodyLong>
            <Heading level="2" spacing size="medium">
                Hva skjer nå?
            </Heading>
            <BodyLong className="mb-8">
                Du vil få en forespørsel om å dele CV i aktivitetsplanen din på nav.no dersom du er relevant for
                stillingen. I mellomtiden kan du oppdatere CV’en din på nav.no.
            </BodyLong>
            <BodyLong className="mb-8">
                Bedriften vil vurdere din søknad og ta kontakt dersom de syns du passer for jobben. Du får beskjed på
                e-post så fort bedriften har gjort en vurdering.
            </BodyLong>
            <Button variant="secondary" as={Link} href="/stillinger?jobseeker=true">
                Søk etter flere jobber
            </Button>

            <GiveFeedback />
        </>
    );
}

export default Success;
