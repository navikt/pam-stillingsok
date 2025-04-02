import { BodyLong, BodyShort, Heading, Link as AkselLink } from "@navikt/ds-react";
import { ChevronLeftIcon } from "@navikt/aksel-icons";
import NextLink from "next/link";

export default function Vilkar() {
    return (
        <article className="container-small mt-5 mb-24">
            <AkselLink as={NextLink} href="/vilkar-og-retningslinjer" className="mb-8">
                <ChevronLeftIcon aria-hidden="true" />
                <BodyShort>Til Vilkår og retningslinjer</BodyShort>
            </AkselLink>
            <Heading spacing size="xlarge" level="1">
                Vilkår for å publisere stillinger
            </Heading>

            <Heading size="large" level="2" spacing>
                Hvem kan bruke tjenestene
            </Heading>
            <BodyLong className="mb-12">
                Arbeidsgiveren i en virksomhet gir tilganger til sine ansatte i Altinn. Har flere ansatte fått tilgang
                til å publisere stillinger på Arbeidsplassen, kan de se og utføre det samme, også endre det som en annen
                har lagt inn.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                Bruk av opplysninger i CV-er
            </Heading>
            <BodyLong spacing>
                Du kan kun bruke opplysninger i CV-er hvis målet er å bemanne, rekruttere eller oppfordre personer til å
                søke på stillinger.
            </BodyLong>
            <BodyLong>Det er ikke tillatt å bruke CV-er til andre formål, slik som å</BodyLong>
            <ul>
                <li>
                    <BodyLong>
                        bruke opplysninger i forbindelse med salg eller markedsføring av varer eller tjenester
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>tilby arbeidssøkere stillinger der arbeidssøkeren må betale for å søke</BodyLong>
                </li>
                <li>
                    <BodyLong>tilby personer arbeidstreningsplasser</BodyLong>
                </li>
            </ul>
            <BodyLong className="mb-12">Nav vil følge opp brudd på disse vilkårene hvis det forekommer.</BodyLong>

            <Heading size="large" level="2" spacing>
                Publisere stillinger
            </Heading>
            <BodyLong spacing>
                Hvis du ønsker å annonsere ledige stillinger på Arbeidsplassen og{" "}
                <AkselLink href="https://eures.europa.eu/index_en">Den Europeiske Jobbmobilitetsportalen</AkselLink>, må
                du som arbeidsgiver godta vilkårene under.
            </BodyLong>
            <BodyLong>
                Stillingsannonsen blir synlig på Arbeidsplassen få minutter etter at du har sendt den til publisering.
                Nav kontrollerer i etterkant og tar kontakt hvis annonsen bryter med vilkårene og fjernes, slik at du
                kan rette opp og sende inn for godkjenning på nytt. Tjenesten er kostnadsfri.
            </BodyLong>
            <ul>
                <li>
                    <BodyLong>
                        Du kan bare annonsere en ledig stilling på Arbeidsplassen når du vil tilby en kandidat
                        ansettelse.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Når du ansetter en person betyr det at du skal melde arbeidstakeren inn i Arbeidsgiver- og
                        arbeidstakerregisteret.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Du har ikke anledning til å publisere annonser til oppdrag for selvstendig næringsdrivende eller
                        ulike forretningskonsepter som for eksempel franchise, forhandler, agentur, nettverkssalg og
                        «homeparty».
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Du kan ikke bruke stillingsannonsen til salg eller markedsføring av varer, tjenester eller
                        lignende.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Hvis du vil tilby ansettelse, kan du ikke kreve noen form for avgift eller annen godtgjørelse
                        fra arbeidssøkeren.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Stillingsannonsen din skal gi arbeidssøkeren tilstrekkelig informasjon om virksomheten,
                        arbeidsoppgaver, godtgjørelse og ansettelsesforhold.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Stillingsannonsen skal ikke forskjellsbehandle ut fra kjønn, alder, etnisk bakgrunn eller andre
                        kriterier som ikke er relevante. Annonsen skal heller ikke ha uetisk innhold eller kunne støte
                        noen. Den skal ikke oppfordre til ulovlige handlinger eller være i strid med norsk lov eller{" "}
                        <AkselLink as={NextLink} href="/retningslinjer-stillingsannonser">
                            Navs retningslinjer for stillingsannonser.
                        </AkselLink>
                    </BodyLong>
                </li>
            </ul>
            <BodyLong className="mb-12">
                Hvis Nav oppdager en annonse som ikke fyller vilkårene når vi kontrollerer innholdet, eller etter at
                annonsen er publisert, kan den bli slettet eller fjernet uten varsling. Nav vil ta kontakt og informere
                i etterkant.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                Personopplysninger
            </Heading>
            <BodyLong>
                Nav er pålagt å drive en statlig arbeidsformidling og formidle arbeidskraft. For å kunne tilby disse
                tjenestene til arbeidsgivere, må vi lagre nødvendige personopplysninger. Vi lagrer disse opplysningene:
            </BodyLong>
            <ul>
                <li>
                    <BodyLong>
                        Stillinger som virksomheten har publisert på Arbeidsplassen, herunder personopplysninger du har
                        oppgitt. Annonsene arkiveres og anonymiserte opplysninger brukes til statistiske formål.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong spacing>
                        Kandidatlister som virksomheten har opprettet, og anonymiserte opplysninger fra disse. Denne
                        informasjonen bruker Nav til å forbedre tjenesten.
                    </BodyLong>
                </li>
            </ul>
            <BodyLong spacing>
                For mer informasjon,{" "}
                <AkselLink href="https://www.nav.no/personvernerklaering">se Navs personvernerklæring.</AkselLink>
            </BodyLong>
            <BodyLong>
                Har du spørsmål, ta gjerne kontakt med oss:{" "}
                <AkselLink href="https://www.nav.no/arbeidsgiver/kontaktoss">Kontakt Nav – arbeidsgiver.</AkselLink>
            </BodyLong>
        </article>
    );
}
