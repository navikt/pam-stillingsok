import React, { ReactElement, useEffect, useRef } from "react";
import { BodyLong, Button, Heading } from "@navikt/ds-react";
import Link from "next/link";
import GiveFeedback from "./GiveFeedback";

function Success({ email }: { email: string }): ReactElement {
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
                Søknaden din er sendt til bedriften
            </Heading>
            <BodyLong spacing>
                Du vil straks få en bekreftelse på e-posten din {email}. Ønsker du å trekke søknaden din finner du
                informasjon om dette i e-posten.
            </BodyLong>
            <Heading level="2" spacing size="medium">
                Hva skjer nå?
            </Heading>
            <BodyLong className="mb-8">
                Bedriften vil vurdere søknaden din og ta kontakt dersom de syns du passer for jobben. Du får beskjed på
                e-post så fort bedriften har gjort en vurdering.
            </BodyLong>
            <Button variant="secondary" as={Link} href="/">
                Tilbake til stillingssøket
            </Button>

            <GiveFeedback />
        </>
    );
}

export default Success;
