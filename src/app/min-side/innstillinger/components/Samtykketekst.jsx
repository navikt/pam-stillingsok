import { BodyLong, Heading, Link as DsLink } from "@navikt/ds-react";
import React from "react";

export default function Samtykketekst() {
    return (
        <>
            <BodyLong className="mb-6">
                Nav er ansvarlig for at personopplysninger blir behandlet etter personopplysningsloven. Det er frivillig
                å ta i bruk tjenestene.
            </BodyLong>
            <BodyLong className="mb-6">
                I{" "}
                <DsLink href="https://www.nav.no/personvernerklaering" inlineText>
                    Navs personvernerklæring
                </DsLink>{" "}
                finner du generell informasjon om behandling av personopplysninger i Nav og hvilke rettigheter du har.
            </BodyLong>
            <Heading level="4" size="small">
                Vi deler ikke din informasjon med andre
            </Heading>
            <BodyLong className="mb-6">
                Det er kun du som som har tilgang til dine lagrede søk og favoritter. Vi deler hverken disse eller din
                e-postadresse med andre.
            </BodyLong>
            <Heading level="4" size="small">
                Anonymiserte data kan brukes til statistiske formål
            </Heading>
            <BodyLong className="mb-6">
                Dine lagrede søk og favoritter kan, etter anonymisering, brukes til statistiske formål.
            </BodyLong>
            <Heading level="4" size="small">
                Du kan når som helst slette samtykket ditt
            </Heading>
            <BodyLong>
                Du kan når som helst slette samtykket ditt inne på dine innstillinger. Når du sletter ditt samtykke vil
                dine lagrede søk og favoritter slettes, i tillegg til e-postadressen for varsel dersom du har oppgitt
                det.
            </BodyLong>
        </>
    );
}
