import { BodyLong, CopyButton, Heading, Link as AkselLink } from "@navikt/ds-react";
import NextLink from "next/link";
import React from "react";

export default function HvordanFaTilgang() {
    return (
        <article className="container-small mt-5 mb-24">
            <Heading level="1" size="xlarge">
                Slik kan du skaffe deg tilgang
            </Heading>

            <ol>
                <li>
                    <BodyLong className="mb-2">
                        Finn ut hvem som kan gi deg tilgang. Du kan starte med å spørre din leder. Tilgangen til
                        arbeidsplassen.no sine rekrutteringstjenester håndteres av arbeidsgivere selv i Altinn. Det kan
                        være noen i HR, leder, mellomleder eller noen på eiersiden i din bedrift som kan gi deg tilgang.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong className="mb-2">
                        Kopier lenken til denne guiden og del med personen som skal gi deg tilgang.
                    </BodyLong>
                </li>
            </ol>

            <CopyButton
                copyText="https://arbeidsplassen.nav.no/hvordan-fa-tilgang"
                text="Kopier lenken til denne siden"
                activeText="Lenke kopiert"
                variant="action"
                className="mb-12"
            />

            <Heading level="2" size="large" spacing>
                Personen som skal gi deg tilgang må enten være
            </Heading>

            <ul className="mb-12">
                <li>
                    <BodyLong className="mb-2">
                        registrert i Enhetsregisteret som daglig leder, styrets leder, bestyrende reder eller innehaver
                    </BodyLong>
                </li>
                <li>
                    <BodyLong className="mb-2">registert som hovedadministrator i Altinn eller</BodyLong>
                </li>
                <li>
                    <BodyLong className="mb-2">
                        registert med Altinn-rolle som "Tilgangsstyrer" + enten "Rekruttering", "Lønn og
                        personalmedarbeider" eller "Utfyller/innsender".
                    </BodyLong>
                </li>
            </ul>

            <Heading level="2" size="large" spacing>
                Hva må personen som skal gi deg tilgang gjøre?
            </Heading>

            <BodyLong>
                Personen som skal gi tilgang må logge inn i Altinn og følge en enkel trinn-for-trinn guide.
            </BodyLong>

            <ol>
                <li>
                    <BodyLong className="mb-2">Velg virksomheten din under "Alle dine aktører"</BodyLong>
                </li>
                <li>
                    <BodyLong className="mb-2">Trykk på knappen "Profil" øverst i menyen</BodyLong>
                </li>
                <li>
                    <BodyLong className="mb-2">Trykk på "Andre med rettigheter til virksomheten"</BodyLong>
                </li>
                <li>
                    <BodyLong className="mb-2">Velg "Legge til ny person eller virksomhet"</BodyLong>
                </li>
                <li>
                    <BodyLong className="mb-2">
                        Legg inn personnummeret og etternavnet til personen som skal ha tilgang
                    </BodyLong>
                </li>
                <li>
                    <BodyLong className="mb-2">Velg "Gi tilgang til enkelttjenester"</BodyLong>
                </li>
                <li>
                    <BodyLong className="mb-2">
                        Skriv "Rekruttering", så vil alternativet komme opp som et valg. Velg "Rekruttering". Denne
                        tilgangen gir kun mulighet til å bruke arbeidsplassen.no sine rekrutteringstjenester og
                        ingenting annet
                    </BodyLong>
                </li>
                <li>
                    <BodyLong className="mb-2">Bekreft</BodyLong>
                </li>
            </ol>

            <AkselLink as={NextLink} href="/arbeidsgivertjenester">
                Les mer om tilgangsstyring i virksomheter og finn skjermbilder her
            </AkselLink>
        </article>
    );
}
