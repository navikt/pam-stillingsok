import { BodyLong, BodyShort, Heading, Link as AkselLink } from "@navikt/ds-react";
import { ChevronLeftIcon } from "@navikt/aksel-icons";
import NextLink from "next/link";

export default function VilkarApi() {
    return (
        <article className="container-small mt-5 mb-24">
            <AkselLink as={NextLink} href="/vilkar-og-retningslinjer" className="mb-8">
                <ChevronLeftIcon aria-hidden="true" />
                <BodyShort>Til Vilkår og retningslinjer</BodyShort>
            </AkselLink>

            <Heading spacing size="xlarge" level="1">
                Vilkår for bruk av Navs stillingsannonse API
            </Heading>

            <Heading size="large" level="2" spacing>
                Beskrivelse av tjenesten
            </Heading>
            <BodyLong spacing>
                Nav tilbyr et API med offentlige utlyste stillinger fra Navs database. Dette kan være jobbannonser
                direkte registrert hos Nav eller hentet inn fra Navs samarbeidspartnere (omtalt som systemleverandør i
                punkt d).
            </BodyLong>
            <BodyLong className="mb-12">Konsumenter kan koble seg til APIet og hente disse jobbannonsene.</BodyLong>

            <Heading size="large" level="2" spacing>
                Hvem kan bruke tjenestene
            </Heading>
            <BodyLong spacing>
                Alle kan bruke tjenesten. Tjenesten er kostnadsfri og leveres av Nav. Nav forbeholder seg retten til å
                stoppe tilgang ved feil bruk av tjenesten.
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Vilkår for bruk av APIet
            </Heading>
            <BodyLong spacing>
                Konsumenter av APIet har rett til å republisere og vise mottatte jobbannonser på sine tjenester,
                og/eller bruke de til statistiske/analytiske formål.
            </BodyLong>
            <BodyLong>Konsument forplikter seg til at:</BodyLong>
            <ol type="a" className="mb-12">
                <li>
                    <BodyLong>
                        Alle annonser som er hentet fra Nav og republisert hos Konsuments tjenester skal umiddelbart
                        fjernes fra resultatlisten til Konsumenten når annonsen blir inaktiv eller slettet hos Nav.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Alle annonser som er hentet fra Nav og republisert hos Konsuments tjenester skal umiddelbart
                        endres når en annonse blir oppdatert i APIet.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Når en annonse åpnes fra resultatlisten, kan annonsen vises på samme domene som resultatlisten.
                        Det betyr at en annonse hentet fra Nav kan åpnes av jobbsøker på Konsumentens tjenester.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Jobbannonsens «søknadsfunksjon» skal dyplenke direkte til systemleverandørs søknadsfunksjon når
                        den åpnes av en jobbsøker. Det betyr for eksempel at når en jobbsøker trykker på «søk på
                        stillingen» i annonsevisningen på Finn.no, skal jobbsøker lenkes videre til kilden for
                        søknadsfunksjonen.
                    </BodyLong>
                </li>
            </ol>
            <Heading size="large" level="2" spacing>
                Behandling av personopplysninger
            </Heading>
            <BodyLong>
                Partene skal opptre som separate behandlingsansvarlige når det gjelder behandlingen av
                personopplysninger i forbindelse med samarbeidet regulert av denne avtalen. Konsument vil motta
                personopplysninger som inngår i jobbannonsene som Nav deler med Konsument under denne avtalen. Konsument
                forplikter seg til å behandle personopplysninger i henhold til gjeldende lover, inkludert
                personopplysningsloven (LOV-2018-06-15-38). Konsument sine forpliktelser inkluderer, men er ikke
                begrenset til, følgende:
            </BodyLong>
            <ol className="mb-12">
                <li>
                    <BodyLong>
                        Sørge for at Konsument behandler personopplysninger i henhold til gjeldende lover, inkludert å
                        sørge for lovlig behandlingsgrunnlag for innsamling av personopplysninger, og behandlingen av
                        personopplysninger forøvrig, under denne avtalen.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Sørge for informasjon om deling av annonser som inneholder personopplysninger og overholde
                        informasjonskravet i personopplysningsloven for øvrig.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Sørge for begrensninger i lagringstiden til personopplysninger slik at personopplysninger
                        slettes så snart personopplysningene ikke lenger er nødvendige for det opprinnelige formålet med
                        behandlingen eller øvrige formål, og i henhold til informasjonen som er gitt til de registrerte
                        om formål og lagringstider.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Håndheve de registrertes rettigheter, inkludert men ikke begrenset til å besvare henvendelser
                        fra de registrerte om innsyn og sletting i henhold til personopplysningsloven.
                    </BodyLong>
                </li>
            </ol>
            <Heading size="large" level="2" spacing>
                Slik får du tilgang
            </Heading>
            <BodyLong spacing>
                Mer informasjon om API-et og tilkobling finner du i{" "}
                <AkselLink href="https://data.norge.no/datasets/62409bc8-680d-3f70-98bf-d2f2beebaa50">
                    Datasettbeskrivelse i Felles datakatalog.
                </AkselLink>
            </BodyLong>
            <BodyLong className="mb-12">
                Har du spørsmål kan du kontakte oss på e-post{" "}
                <AkselLink href="mailto:nav.team.arbeidsplassen@nav.no">nav.team.arbeidsplassen@nav.no</AkselLink>.
            </BodyLong>
        </article>
    );
}
