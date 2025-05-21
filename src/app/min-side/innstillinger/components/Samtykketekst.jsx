import Link from "next/link";
import { BodyLong, Link as AkselLink } from "@navikt/ds-react";
import React from "react";

export default function Samtykketekst() {
    return (
        <>
            <BodyLong className="mb-6">
                Nav er ansvarlig for at personopplysninger blir behandlet etter personopplysningsloven. Det er frivillig
                å ta i bruk tjenestene.
            </BodyLong>
            <BodyLong spacing>
                Vi lagrer dine favoritter, søk med kriterier og e-postadresse (valgfritt). Det er kun du som kan se
                dette, og vi deler ikke informasjonen med andre. Anonymiserte data kan brukes til statistikk.
            </BodyLong>
            <BodyLong>
                Du kan når som helst trekke samtykket i innstillingene. Da slettes alle lagrede søk, favoritter og
                eventuell e-postadresse du har oppgitt. Les mer i{" "}
                <AkselLink as={Link} href="/personvern" inlineText>
                    Arbeidsplassens personvernerklæring
                </AkselLink>
                .
            </BodyLong>
        </>
    );
}
