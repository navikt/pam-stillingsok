import { BodyLong, Heading, Link as AkselLink } from "@navikt/ds-react";
import NextLink from "next/link";

export default function SporsmalOgSvar() {
    return (
        <article className="container-small mt-5 mb-24">
            <Heading size="xlarge" level="1" spacing>
                Spørsmål og svar
            </Heading>

            <Heading size="small" level="2" spacing>
                Hva er arbeidsplassen.no?
            </Heading>
            <BodyLong className="mb-12">
                På arbeidsplassen.no har vi samlet nye, selvbetjente løsninger. Her kan jobbsøkere og arbeidsgivere
                enkelt finne hverandre.{" "}
                <AkselLink as={NextLink} href="/om-arbeidsplassen">
                    Les mer om tjenestene på arbeidsplassen.no.
                </AkselLink>
            </BodyLong>

            <Heading size="small" level="2" spacing>
                Hva er fordelene ved å bruke arbeidsplassen.no?
            </Heading>
            <BodyLong className="mb-12">
                På arbeidsplassen.no finner du brukervennlige, sikre tjenester, fri for kommersielle interesser.
                Tjenestene har cirka 700 000 unike brukere i måneden. Det kommer 45 000 nye stillinger hver måned. På
                arbeidsplassen.no finner du alle utlyste stillinger i landet, og sjansen er god for å finne en jobb.
            </BodyLong>

            <Heading size="small" level="2" spacing>
                Hvorfor må jeg logge inn med ID-porten, og ikke med brukernavn og passord?
            </Heading>
            <BodyLong className="mb-12">
                Innlogging via ID-porten, med for eksempel MinID eller BankID, gjør at tjenestene er helt sikre å bruke
                – og at personopplysningene dine er godt ivaretatt. Samtidig slipper du å huske enda et brukernavn og
                passord.
            </BodyLong>

            <Heading size="small" level="2" spacing>
                Jeg er arbeidsgiver. Hvordan kommer jeg i gang med å bruke arbeidsplassen.no?
            </Heading>
            <BodyLong className="mb-12">
                Du har nå mulighet til å gjøre rekrutteringsprosessen i helt nye digitale verktøy. Er du på jakt etter
                nye medarbeidere anbefaler vi at du registrerer en stillingsannonse og fyller ut så mye relevant
                informasjon om bedriften og stillingen som mulig. En informativ stillingsannonse gjør det lettere for
                jobbsøkere å vurdere om stillingen kan være interessant for dem. Har du behov for rekrutteringsbistand
                fra Nav, finner du kontaktinformasjon til erfarne rådgivere i tjenesten.
            </BodyLong>

            <Heading size="small" level="2" spacing>
                Jeg er jobbsøker. Har dere noen råd til meg når jeg skal begynne å bruke arbeidsplassen.no?
            </Heading>
            <BodyLong className="mb-12">
                Vi vet det kan være utfordrende å være på jakt etter jobb. Derfor har vi samlet mange{" "}
                <AkselLink href="https://www.nav.no/kom-i-gang-som-jobbsoker?situasjon=bytte-jobb">
                    jobbsøkertips på denne siden.
                </AkselLink>{" "}
                Du bør starte med å fylle ut CV-en og jobbprofilen din med så mye relevant informasjon som mulig. Da
                blir det lettere for arbeidsgivere å vurdere om du kan være den riktige kandidaten. Vi anbefaler også at
                du lagrer faste søk i stillingssøket. Da kan du få varsel på e-post når det blir publisert
                stillingsannonser som er interessante for deg.
            </BodyLong>

            <Heading size="small" level="2" spacing>
                Hvor mange bruker arbeidsplassen.no i dag?
            </Heading>
            <BodyLong className="mb-12">
                Tjenestene på arbeidsplassen.no har cirka 700 000 unike brukere i måneden. 45 000 nye stillinger blir
                registrert hver måned.
            </BodyLong>

            <Heading size="small" level="2" spacing>
                Jeg mangler tilgang til arbeidsgivertjenestene. Hva gjør jeg?
            </Heading>
            <BodyLong>
                Vi har samlet informasjon om hva du trenger og hvordan du skaffer tilganger på siden{" "}
                <AkselLink as={NextLink} href="/arbeidsgivertjenester">
                    Hvem kan bruke arbeidsgivertjenestene.
                </AkselLink>
            </BodyLong>
        </article>
    );
}
