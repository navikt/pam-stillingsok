import { BodyLong, Heading, Link as AkselLink } from "@navikt/ds-react";
import NextLink from "next/link";

export default function VilkarOgRetningslinjer() {
    return (
        <article className="container-small mt-5 mb-24">
            <Heading spacing size="xlarge" level="1">
                Vilkår og retningslinjer
            </Heading>

            <Heading size="large" level="2" spacing>
                Vilkår for å bruke arbeidsgivertjenestene på arbeidsplassen.no
            </Heading>
            <BodyLong>
                Arbeidsplassen.no er en kostnadsfri tjeneste fra NAV. Arbeidsgivere må godta flere vilkår for å benytte
                tjenestene på arbeidsplassen.no. Generelle vilkår vi ønsker å trekke frem er:
            </BodyLong>
            <ul className="mb-12">
                <li>
                    <BodyLong>
                        Stillingsannonser som arbeidsgiver skal publisere, må følge{" "}
                        <AkselLink as={NextLink} inlineText href="/retningslinjer-stillingsannonser">
                            retningslinjene for innhold i stillingsannonser
                        </AkselLink>
                        .
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        For å benytte tjenestene på arbeidsplassen.no, må bedriften ha et generelt rekrutteringsbehov.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Enhver personopplysning du mottar fra jobbsøkere må behandles til formålet om rekruttering, og
                        slettes ved endt rekrutteringsprosess.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>Personopplysninger om jobbsøkere, kan ikke brukes til markedsføring.</BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Bruk av automatiserte tjenester (roboter, spidere, indeksering m.m.) samt andre fremgangsmåter
                        for systematisk eller regelmessig kopi av innholdet på arbeidsplassen.no er ikke tillatt uten
                        eksplisitt skriftlig samtykke fra NAV.
                    </BodyLong>
                </li>
            </ul>

            <Heading size="medium" level="3" spacing>
                Hvem kan bruke tjenestene
            </Heading>
            <BodyLong spacing>
                Ansatte i en virksomhet må ha riktige tilganger i Altinn for å kunne benytte arbeidsgivertjenestene på
                arbeidsplassen.no.{" "}
            </BodyLong>
            <BodyLong className="mb-12">
                <AkselLink as={NextLink} href="/arbeidsgivertjenester">
                    Hvem kan bruke arbeidsgivertjenstene på arbeidsplassen.no
                </AkselLink>
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Personopplysninger
            </Heading>
            <BodyLong spacing>
                NAV er pålagt å drive en statlig arbeidsformidling og formidle arbeidskraft. For å kunne tilby disse
                tjenestene til arbeidsgivere, må vi lagre nødvendige personopplysninger. Vi lagrer disse opplysningene:
            </BodyLong>
            <ul>
                <li>
                    <BodyLong>
                        Stillinger som virksomheten har publisert på arbeidsplassen.no, herunder personopplysninger du
                        har oppgitt. Annonsene arkiveres og anonymiserte opplysninger brukes til statistiske formål.
                    </BodyLong>
                </li>
            </ul>
            <BodyLong spacing>
                For mer informasjon,{" "}
                <AkselLink as={NextLink} href="/arbeidsgivertjenester">
                    se NAVs personvernerklæring.
                </AkselLink>
            </BodyLong>
            <BodyLong className="mb-12">
                Har du spørsmål, ta gjerne kontakt med oss:{" "}
                <AkselLink href="https://www.nav.no/arbeidsgiver/kontaktoss" inlineText>
                    Kontakt NAV - arbeidsgiver
                </AkselLink>
            </BodyLong>

            <Heading size="large" level="2" spacing>
                Vilkår for å publisere stillingsannonser
            </Heading>
            <BodyLong spacing>
                For å annonsere ledige stillinger på arbeidsplassen.no og Den Europeiske Jobbmobilitetsportalen, må du
                blant annet ha en konkret stilling du ønsker å ansette til. Stillingsannonsen kan ikke
                forskjellsbehandle ut fra kjønn, alder, etnisk bakgrunn eller andre kriterier som ikke er relevante for
                stillingen.
            </BodyLong>
            <BodyLong spacing>
                Hvis NAV oppdager en annonse som ikke oppfyller vilkårene, kan den bli slettet eller fjernet uten
                varsling. NAV vil ta kontakt og informere i etterkant.
            </BodyLong>
            <BodyLong className="mb-12">
                <AkselLink as={NextLink} href="/vilkar-stillingsannonser">
                    Vilkår for å publisere stillingsannonser på arbeidsplassen.no
                </AkselLink>
            </BodyLong>

            <Heading size="large" level="2" spacing>
                Vilkår for bruk av superrask søknad
            </Heading>
            <BodyLong spacing>
                Personopplysninger som du mottar fra jobbsøkere i “superrask søknad” kan kun brukes så lenge formålet er
                å bemanne og rekruttere til en konkret stilling.
            </BodyLong>
            <BodyLong className="mb-12">
                <AkselLink as={NextLink} href="/vilkar-superrask-soknad">
                    Vilkår for bruk av superrask søknad på arbeidsplassen.no
                </AkselLink>
            </BodyLong>

            <Heading size="large" level="2" spacing>
                Vilkår for bruk av API for stillingsannonser
            </Heading>
            <BodyLong spacing>
                Gjennom arbeidsplassen.no tilbyr NAV data fra stillingssøket på arbeidsplassen.no. Stillingssøket
                inneholder en oversikt og informasjon om de fleste aktive utlyste stillinger. Stillingssøket inneholder
                både stillinger som er registrert direkte hos NAV, publisert til NAV via et åpent API og hentet inn fra
                våre samarbeidspartnere.
            </BodyLong>
            <BodyLong className="mb-24">
                <AkselLink as={NextLink} href="/vilkar-api">
                    Vilkår for bruk av API for stillingsannonser på arbeidsplassen.no
                </AkselLink>
            </BodyLong>
        </article>
    );
}
