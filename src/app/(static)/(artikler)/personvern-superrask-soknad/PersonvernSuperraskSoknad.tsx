import { BodyLong, Heading, Link, List } from "@navikt/ds-react";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import { ListItem } from "@navikt/ds-react/List";

type Props = {
    readonly meta: PageInfo;
};

export default function PersonvernSuperraskSoknad({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language}>
            <Heading size="xlarge" level="1" spacing>
                {meta.title}
            </Heading>
            <BodyLong className="mb-8">Sist endra 16. januar 2023</BodyLong>

            <BodyLong spacing>
                Superrask søknad er ein frivillig og sjølvbetjent teneste for deg som er jobbsøkjar.
            </BodyLong>
            <BodyLong spacing>
                Superrask søknad er meint å forenkla prosessen med å skaffa arbeid for jobbsøkjarar, og dessutan
                forenkla arbeidsgivars prosess med å rekruttera arbeidskraft.
            </BodyLong>
            <BodyLong className="mb-12">
                Arbeids- og velferdsdirektoratet har ansvaret for behandlinga av personopplysningane dine når du sender
                inn ein søknad gjennom tenesta superrask søknad.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                Innhald
            </Heading>
            <List className="mb-12">
                <ListItem>
                    <AkselNextLink href="#information">Hvilke personopplysningar behandlar me?</AkselNextLink>
                </ListItem>
                <ListItem>
                    <AkselNextLink href="#goals">Kva formål blir personopplysningane brukte til?</AkselNextLink>
                </ListItem>
                <ListItem>
                    <AkselNextLink href="#legal">
                        Kva er det rettslege grunnlaget for behandlinga av personopplysningar?
                    </AkselNextLink>
                </ListItem>
                <ListItem>
                    <AkselNextLink href="#time">Kor lenge lagrar me personopplysningane dine?</AkselNextLink>
                </ListItem>
                <ListItem>
                    <AkselNextLink href="#who">Kven kan få tilgang til personopplysningane dine?</AkselNextLink>
                </ListItem>
                <ListItem>
                    <AkselNextLink href="#rights">Kva rettar har du?</AkselNextLink>
                </ListItem>
            </List>

            <Heading size="large" level="2" spacing id="information">
                Kva personopplysningar behandlar me?
            </Heading>
            <BodyLong spacing>
                Når du bruker superrask søknad blir det behandla personopplysningar om ditt namn, e-post, telefonnummer,
                Ip-adresse og opplysningar om kompetansen din. Med unntak av IP-adresse, er dette personopplysningar du
                sjølv oppgir i tenesta.
            </BodyLong>
            <BodyLong spacing>
                Tenesta krev ikkje innlogging, og derfor blir det heller ikkje innhenta personopplysningar direkte frå
                Folkeregisteret.
            </BodyLong>
            <BodyLong className="mb-12">
                Det blir ikkje registrert i tenesta om du er ein frivillig jobbsøkjar, eller om du er ein jobbsøkjar
                under oppfølging hos Nav. Derfor vil personopplysningar knytt til bruken din av superrask søknad ikkje
                dukka opp når du loggar deg inn på nav.no.
            </BodyLong>

            <Heading size="large" level="2" spacing id="goals">
                Kva formål blir personopplysningane brukte til?
            </Heading>
            <BodyLong spacing>
                Formålet med behandlinga av personopplysningar i superrask søknad er å gjera det enklare for deg som er
                jobbsøkjar å skaffa arbeid.
            </BodyLong>
            <BodyLong spacing>
                Personopplysningane blir behandla for å gi deg høve til å søkja på ledige stillingar på ein enkel og
                rask måte. Ved å senda inn ein superrask søknad kan du fortelja arbeidsgivar at du er interessert i
                stillinga, samtidig som du berre gir relevante og nødvendige opplysningar om kompetansen og
                kontaktinformasjonen din.
            </BodyLong>
            <BodyLong className="mb-12">
                Arbeidsgivar får dermed berre tilgang til personopplysningar som er nødvendige og relevante, for å kunna
                vurdera om du er aktuell for stillinga, og for å kunna kalla deg inn til intervju og liknande.
            </BodyLong>

            <Heading size="large" level="2" spacing id="legal">
                Rettsleg grunnlag for behandlinga
            </Heading>
            <BodyLong className="mb-12">
                Det rettslege grunnlaget for behandling av personopplysningar i superrask søknad er
                Personvernforordningen (GDPR) artikkel 6 nr. 1 bokstav e, og lov om arbeids- og velferdsforvaltninga
                (Nav-loven) § 4. Behandlinga av personopplysningar er nødvendig for å oppfylla Navs oppgåve med å hjelpa
                arbeidssøkjarar med å få jobb, og hjelpa arbeidsgivarar med å skaffa arbeidskraft.
            </BodyLong>

            <Heading size="large" level="2" spacing id="time">
                Kor lenge blir opplysningane lagra?
            </Heading>
            <BodyLong className="mb-12">
                Personopplysningane dine blir lagra i tre månader rekna frå utløpsdatoen til stillingsannonsen.
            </BodyLong>

            <Heading size="large" level="2" spacing id="who">
                Kven kan få tilgang til personopplysningane dine?
            </Heading>
            <BodyLong spacing>
                Arbeidsgivarar du sender inn superrask søknad til, får tilgang til personopplysningar som namn, e-post,
                telefonnummer og kompetansar, som du sjølv registrerer ved innsending av søknaden.
            </BodyLong>
            <BodyLong className="mb-12">
                Nav-tilsette, til dømes utviklarar, kan ved tjenstleg behov få tilgang til personopplysningane dine.
            </BodyLong>

            <Heading size="large" level="2" spacing id="rights">
                Kva rettar har du?
            </Heading>

            <Heading size="small" level="3" spacing>
                Rett til informasjon
            </Heading>
            <BodyLong spacing>
                Du har rett til å få informasjon om korleis personopplysningane dine blir behandla. Din rett til
                informasjon om behandlinga blir vareteke av denne personvernerklæringa.
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Rett til innsyn
            </Heading>
            <BodyLong spacing>
                Du har rett til å få innsyn i kva personopplysningar me har om deg. Du kan be om innsyn i kva
                personopplysningar som blir registrerte om deg når du bruker tenesta superrask søknad.
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Rett til retting
            </Heading>
            <BodyLong spacing>
                Du kan be om at opplysningar om deg blir retta viss opplysningane er feil eller misvisande. Det er
                viktig at opplysningar me har om deg er rette og oppdaterte, for mellom anna å sikra at søknaden din
                blir riktig behandla. Du kan ikkje retta opp allereie innsend søknad, men du kan trekkja tilbake den du
                har sendt inn, og senda ein ny søknad om ønskjeleg.
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Rett til sletting
            </Heading>
            <BodyLong spacing>
                Du kan ha rett til å få sletta opplysningar om deg. For at Nav skal kunna sletta personopplysningar om
                deg, føreset det at me ikkje har ei lovpålagd plikt etter arkivlova, eller anna lovgiving til å lagra
                opplysningane. Du kan sjølv slette ein superrask søknad, ved å bruka lenkja du får tilsendt per e-post
                etter innsending av søknad. Dersom du vel å sletta søknaden, vil søknaden din også bli sletta frå
                arbeidsgivars liste.
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Rett til avgrensing av behandlinga
            </Heading>
            <BodyLong spacing>
                Du kan be om at Nav mellombels stoppar behandlinga av opplysningane dine, dersom du meiner at
                opplysningane me har om deg er feil, eller om du meiner behandlinga er ulovleg. Det same gjeld dersom du
                meiner at me ikkje treng opplysningane. Når opplysningane blir avgrensa, vil dei framleis bli lagra, men
                moglegheita til å bruka personopplysningane blir avgrensa.
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Rett til å protestera mot behandlinga
            </Heading>
            <BodyLong spacing>
                Du kan i somme tilfelle ha rett til å protestera mot behandlinga vår av personopplysningane dine. Dersom
                vilkåra for å protestera mot behandlinga er oppfylte, vil Nav stansa behandlinga, og opplysningane vil
                eventuelt bli sletta.
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Kontakt oss om du har spørsmål
            </Heading>
            <BodyLong spacing>
                Dersom du har spørsmål om rettane dine eller har fleire spørsmål om personvern, kan du kontakta oss.
            </BodyLong>
            <BodyLong spacing>
                Du kan kontakta oss ved å ringje 55 55 33 33, eller logga inn på nav.no og bruka tenesta{" "}
                <Link href="https://www.nav.no/skriv-til-oss">Skriv til oss</Link> om du føretrekkjer det.
            </BodyLong>
            <BodyLong spacing>
                Me skal svara på førespurnader om personopplysningar frå deg kostnadsfritt og seinast innan 30 dagar.
            </BodyLong>
            <BodyLong spacing>
                Personvernombodet i Nav kan gi deg råd og rettleiing om korleis me behandlar personopplysningar, og
                hjelpa deg med å vareta personverninteressene dine.
            </BodyLong>
            <BodyLong spacing>
                <Link href="https://www.nav.no/personvernombudet">Kontakt personvernombodet</Link>
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Du kan klaga til Datatilsynet
            </Heading>
            <BodyLong spacing>
                Du har rett til å klaga til Datatilsynet om du meiner måten me behandlar personopplysningar på er i
                strid med personvernreglane.
            </BodyLong>
            <BodyLong>
                <Link href="https://www.datatilsynet.no/om-datatilsynet/kontakt-oss/klage-til-datatilsynet/">
                    Informasjon om klage til Datatilsynet
                </Link>
            </BodyLong>
        </ArticleWrapper>
    );
}
