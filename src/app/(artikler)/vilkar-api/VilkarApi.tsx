import { BodyLong, BodyShort, Heading, Link, List } from "@navikt/ds-react";
import { ChevronLeftIcon } from "@navikt/aksel-icons";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import { ListItem } from "@navikt/ds-react/List";

type Props = {
    readonly meta: PageInfo;
};

export default function VilkarApi({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language}>
            <AkselNextLink href="/vilkar-og-retningslinjer" className="mb-8">
                <ChevronLeftIcon aria-hidden="true" />
                <BodyShort>Til Vilkår og retningslinjer</BodyShort>
            </AkselNextLink>

            <Heading spacing size="xlarge" level="1">
                {meta.title}
            </Heading>

            <Heading size="large" level="2" spacing>
                Beskrivelse av tenesta
            </Heading>
            <BodyLong spacing>
                Nav tilbyr eit API med offentlege kunngjorde stillingar frå Navs database. Dette kan vere jobbannonsar
                direkte registrert hos Nav eller henta inn frå Navs samarbeidspartnarar (omtalt som systemleverandør i
                punkt d).
            </BodyLong>
            <BodyLong className="mb-12">Konsumentar kan kople seg til APIet og hente desse jobbannonsane.</BodyLong>

            <Heading size="large" level="2" spacing>
                Kven kan bruke tenestene
            </Heading>
            <BodyLong spacing>
                Alle kan bruke tenesta. Tenesta er kostnadsfri og blir levert av Nav. Nav sikrar seg retten til å stoppe
                tilgang ved feil bruk av tenesta.
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Vilkår for bruk av APIet
            </Heading>
            <BodyLong spacing>
                Konsumenter av APIet har rett til å republisere og vise mottekne jobbannonsar på sine tenester, og/eller
                bruke dei til statistiske/analytiske formål.
            </BodyLong>
            <BodyLong>Konsument forpliktar seg til at:</BodyLong>
            <ol type="a" className="mb-12">
                <li>
                    <BodyLong>
                        Alle annonsar som er henta frå Nav og republiserte hos Konsuments tenester skal straks fjernast
                        frå resultatlista til Konsumenten når annonsen blir inaktiv eller sletta hos Nav.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Alle annonsar som er henta frå Nav og republiserte hos Konsuments tenester skal straks endrast
                        når ein annonse blir oppdatert i APIet.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Når ein annonse blir opna frå resultatlista, kan annonsen visast på same domene som
                        resultatlista. Det betyr at ein annonse henta frå Nav kan opnast av jobbsøkjar på Konsumentens
                        tenester.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Jobbannonsens «søknadsfunksjon» skal djuplenkje direkte til systemleverandørs søknadsfunksjon
                        når han blir opna av ein jobbsøkjar. Det betyr til dømes at når ein jobbsøkjar trykkjer på «søk
                        på stillinga» i annonsevisninga på Finn.no, skal jobbsøkjar lenkjast vidare til kjelda for
                        søknadsfunksjonen.
                    </BodyLong>
                </li>
            </ol>
            <Heading size="large" level="2" spacing>
                Behandling av personopplysningar
            </Heading>
            <BodyLong>
                Partene skal opptre som separate behandlingsansvarlege når det gjeld behandlinga av personopplysningar i
                samband med samarbeidet regulert av denne avtalen. Konsument vil få personopplysningar som inngår i
                jobbannonsane som Nav deler med Konsument under denne avtalen. Konsument forpliktar seg til å behandle
                personopplysningar i samsvar med gjeldande lover, inkludert personopplysningslova (LOV-2018-06-15-38).
                Konsument forpliktingane sine inkluderer, men er ikkje avgrensa til, følgjande:
            </BodyLong>
            <List as="ol" className="mb-12">
                <ListItem>
                    Sørgje for at Konsument behandlar personopplysningar i samsvar med gjeldande lover, inkludert å
                    sørgje for lovleg behandlingsgrunnlag for innsamling av personopplysningar, og behandlinga av
                    personopplysningar for øvrig, under denne avtalen.
                </ListItem>
                <ListItem>
                    Sørgje for informasjon om deling av annonsar som inneheld personopplysningar og overhalde
                    informasjonskravet i personopplysningslova elles.
                </ListItem>
                <ListItem>
                    Sørgje for avgrensingar i lagringstida til personopplysningar slik at personopplysningar blir sletta
                    så snart personopplysningane ikkje lenger er nødvendige for det opphavlege formålet med behandlinga
                    eller dei øvrige føremåla, og i samsvar med informasjonen som er gitt til dei registrerte om formål
                    og lagringstider.
                </ListItem>
                <ListItem>
                    Håndheve dei registrertes rettar, inkludert men ikkje avgrensa til å svare på førespurnader frå dei
                    registrerte om innsyn og sletting i samsvar med personopplysningslova.
                </ListItem>
            </List>
            <Heading size="large" level="2" spacing>
                Slik får du tilgang
            </Heading>
            <BodyLong spacing>
                Meir informasjon om API-et og tilkopling finn du i{" "}
                <Link href="https://data.norge.no/datasets/62409bc8-680d-3f70-98bf-d2f2beebaa50">
                    Datasettbeskrivelse i Felles datakatalog.
                </Link>
            </BodyLong>
            <BodyLong className="mb-12">
                Har du spørsmål kan du kontakte oss på e-post{" "}
                <Link href="mailto:nav.team.arbeidsplassen@nav.no">nav.team.arbeidsplassen@nav.no</Link>.
            </BodyLong>
        </ArticleWrapper>
    );
}
