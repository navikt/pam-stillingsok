import React, { ReactElement, useEffect, useRef } from "react";
import { BodyLong, Button, Heading } from "@navikt/ds-react";
import Link from "next/link";
import GiveFeedbackInternal from "./GiveFeedbackInternal";

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
            <Heading level="2" className="mt-8" spacing size="medium">
                Hva skjer nå?
            </Heading>
            <BodyLong spacing>
                Hvis du er aktuell for stillingen, får du en forespørsel om å dele CV-en din i aktivitetsplanen på
                nav.no.
            </BodyLong>
            <BodyLong spacing>I mellomtiden kan du gjerne oppdatere CV-en din på nav.no.</BodyLong>

            <BodyLong className="mb-8">
                Bedriften vil så vurdere interessen din, og tar kontakt hvis de ønsker å gå videre med deg. Du vil da få
                beskjed i aktivitetsplanen din.
            </BodyLong>
            <Button variant="secondary" as={Link} href="/muligheter">
                Søk etter flere muligheter
            </Button>

            <GiveFeedbackInternal />
        </>
    );
}

export default Success;
