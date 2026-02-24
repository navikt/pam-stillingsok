import React, { ReactElement, useEffect, useRef } from "react";
import { BodyLong, Button, Heading } from "@navikt/ds-react";
import Link from "next/link";
import GiveFeedbackMuligheter from "./GiveFeedbackMuligheter";

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
                Hvis du er aktuell for stillingen, får du en forespørsel i aktivitetsplanen på nav.no. Der blir du bedt
                om å dele CV-en din med arbeidsgiver.
            </BodyLong>
            <BodyLong spacing>
                Du kan gjerne oppdatere CV-en din før du deler den. Sjekk at kontaktinformasjonen er riktig.
            </BodyLong>

            <BodyLong className="mb-8">
                Arbeidsgiver vil så vurdere interessen din, og tar kontakt hvis de ønsker å gå videre med deg.
            </BodyLong>
            <Button variant="secondary" as={Link} href="/muligheter">
                Søk etter flere muligheter
            </Button>

            <GiveFeedbackMuligheter />
        </>
    );
}

export default Success;
