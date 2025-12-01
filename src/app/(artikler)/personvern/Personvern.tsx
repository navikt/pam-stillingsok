import { BodyLong, Heading, Link as AkselLink, List } from "@navikt/ds-react";
import { LinkPanel, LinkPanelTitle } from "@navikt/ds-react/LinkPanel";
import NextLink from "next/link";
import { ListItem } from "@navikt/ds-react/List";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";

type Props = {
    readonly meta: PageInfo;
};
export default function Personvern({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language} title={meta.title}>
            <BodyLong className="mb-8">Sist oppdatert oktober 2025</BodyLong>
            <BodyLong spacing>
                Arbeidsplassen.no er ei teneste frå Nav og det er Arbeids- og velferdsdirektoratet som er
                behandlingsansvarleg for dine data her. Denne personvernerklæringa er knytt til behandlinga av
                personopplysningar særskilt for tenestene på arbeidsplassen.no.
            </BodyLong>
            <BodyLong spacing>
                Vi lagrar berre personopplysningar i dei innlogga tenestene og ved innhenting av stillingsannonsar frå
                arbeidsgivarar via samarbeidspartnarane våre. For utfyllande informasjon om korleis Nav behandlar
                personopplysningane dine, kan du lese meir i{" "}
                <AkselLink href="https://www.nav.no/personvernerklaering">
                    Navs generelle personvernerklæring.
                </AkselLink>
            </BodyLong>
            <BodyLong spacing>
                For deg som representerer ein arbeidsgivar, les meir lenger nede på sida om korleis vi behandlar
                personopplysningane dine i løysinga.
            </BodyLong>
            <BodyLong className="mb-12">
                <AkselLink as={NextLink} href="/personvern-superrask-soknad">
                    Informasjon om korleis vi behandlar dine data knytt til superrask søknad.
                </AkselLink>
            </BodyLong>

            <Heading size="large" level="2" spacing>
                Innhald
            </Heading>
            <ul aria-label="Innhold på siden" className="mb-12">
                <li>
                    <BodyLong>
                        <AkselLink href="#information">Hvilke personopplysningar samlar vi inn?</AkselLink>
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        <AkselLink href="#goals">Kva formål blir personopplysningane brukte til?</AkselLink>
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        <AkselLink href="#time">Kor lenge blir opplysningane lagra?</AkselLink>
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        <AkselLink href="#legal">
                            Kva er det rettslege grunnlaget for behandlinga av personopplysningar?
                        </AkselLink>
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        <AkselLink href="#who">Kven blir delt opplysningane med?</AkselLink>
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        <AkselLink href="#rights">Kva rettar har du?</AkselLink>
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        <AkselLink href="#cookies">Informasjonskapslar</AkselLink>
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        <AkselLink href="#skyra">Brukerundersøkelser (Skyra)</AkselLink>
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        <AkselLink href="#personalData">
                            Les meir om korleis vi behandlar personopplysningane dine
                        </AkselLink>
                    </BodyLong>
                </li>
            </ul>

            <Heading size="large" level="2" spacing id="information">
                Kva personopplysningar samlar vi inn?
            </Heading>
            <BodyLong>Når du tek i bruk innlogga tenester på arbeidsplassen.no, innhentar vi:</BodyLong>
            <ul aria-label="Når du tek i bruk innlogga tenester på arbeidsplassen.no, innhentar vi">
                <li>
                    <BodyLong>Namn</BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Fødselsnummer - for å sjå om du er under 15 år. Ein får ikkje tilgang om ein er under 15 år.
                        Informasjonen blir ikkje lagra.
                    </BodyLong>
                </li>
            </ul>
            <BodyLong spacing>
                Når du er innlogga kan du ta i bruk funksjonen Favoritter – kvar du kan lagre stillingar du er
                interessert i.
            </BodyLong>
            <BodyLong spacing>
                For å kunne ta i bruk funksjonen Lagrede søk, legg du inn e-postadressa di. Då kan du definere og lagre
                søk og få varsel på e-post når det kjem aktuelle stillingar.
            </BodyLong>
            <BodyLong className="mb-12">
                Du vel sjølv om funksjonen Lagrede søk skal vere aktiv 30, 60 eller 90 dagar. Vi sender deg ein e-post 7
                dagar før det går ut for å høyre om du vil halde fram med å lagre søket. Vi lagrar e-posten din til du
                sletter han på Mi side.
            </BodyLong>

            <Heading size="large" level="2" spacing id="goals">
                Kva formål blir brukte personopplysningane til?
            </Heading>
            <Heading size="medium" level="3" spacing>
                Velfungerande arbeidsmarknad
            </Heading>
            <BodyLong spacing>
                Arbeidsplassen.no skal bidra til ein velfungerande arbeidsmarknad gjennom ei open plattform for
                arbeidsmarknaden. Vi lagrar og behandlar personopplysningar for å gjere det enklare for jobbsøkjarar å
                finne jobb og for arbeidsgivarar å skaffe arbeidskraft. Dette er i tråd med Navs samfunnsoppdrag om å få
                fleire i arbeid.
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Statistikk og kunnskap om arbeidsmarknaden
            </Heading>
            <BodyLong className="mb-12">
                Nav nyttar opplysningane frå arbeidsplassen.no til å utvikle statistikk og kunnskap om arbeidsmarknaden.
                Les meir i{" "}
                <AkselLink href="https://www.nav.no/personvernerklaering#statistikk">
                    Navs generelle personvernerklæring.
                </AkselLink>
            </BodyLong>

            <Heading size="large" level="2" spacing id="time">
                Kor lenge blir opplysningane lagra?
            </Heading>
            <BodyLong className="mb-12">
                Opplysningane blir lagra inntil du slettar dei hos oss. Nav behandlar også opplysningar for
                statistikkformål.
            </BodyLong>

            <Heading size="large" level="2" spacing id="legal">
                Kva er det rettslege grunnlaget for behandlinga av personopplysningar?
            </Heading>
            <Heading size="medium" level="3" spacing>
                Samtykke
            </Heading>
            <BodyLong className="mb-12">
                Når du tek i bruk og legg informasjon inn på innlogga tenester på arbeidsplassen.no, samtykkjer du til
                at vi kan behandle personopplysningar om deg. Du kan sjølv velje kva tenester du vil samtykkje til at vi
                behandlar personopplysningar for. Du kan når som helst trekkje ditt samtykke.
            </BodyLong>

            <Heading size="large" level="2" spacing id="who">
                Kven blir opplysningane delt med?
            </Heading>
            <Heading size="medium" level="3" spacing>
                Databehandlarane våre
            </Heading>
            <BodyLong className="mb-12">
                For å kunne tilby våre tenester på arbeidsplassen.no nyttar vi databehandlarar, som inneber at vi deler
                personopplysningane dine med desse. Dette gjeld til dømes IT-leverandørar som har avtalar med Nav. For å
                lese meir om dette, sjå{" "}
                <AkselLink href="https://www.nav.no/personvernerklaering#hvem">
                    Navs generelle personvernerklæring.
                </AkselLink>
            </BodyLong>

            <Heading size="large" level="2" spacing id="rights">
                Kva rettar har du?
            </Heading>
            <Heading size="medium" level="3" spacing>
                Rett til innsyn og retting
            </Heading>
            <BodyLong spacing>
                Du har rett til å få vite kva personopplysningar vi har om deg og be om retting av feilaktige
                opplysningar. Du kan logge deg inn på Mi side på arbeidsplassen.no for å sjå mange av opplysningane vi
                har registrert om deg. For innsyn i personopplysningar ut over dette, må du{" "}
                <AkselLink href="https://www.nav.no/personvernerklaering#kontakt-nav">
                    ta kontakt med oss på nav.no.
                </AkselLink>
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Rett til å trekkje tilbake samtykke og sletting
            </Heading>
            <BodyLong spacing>
                Når du har samtykt til ei behandling, kan du til kvar tid trekkje tilbake dine samtykke. Dette gjer du
                ved gå til «innstillingar». Der kan du administrere dine samtykke, og slette dei om du ønskjer.
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Rett til dataportabilitet
            </Heading>
            <BodyLong spacing>
                Du har rett til å be oss om å overføre opplysningar om deg til deg eller ein annan behandlingsansvarleg.
                Dette inneber ein rett til å få utlevert i eit maskinlesbart og vanleg brukt filformat dersom du ønskjer
                dette. Formålet med dette er at du skal kunne gjenbruke desse opplysningane hos ein annan
                behandlingsansvarleg, dersom du ønskjer.
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Rett til avgrensing av behandlinga
            </Heading>
            <BodyLong className="mb-12">
                Du har rett til å be om at Nav mellombels stoppar behandlinga av opplysningane dine, dersom du meiner at
                opplysningane vi har om deg er feil eller du meiner at behandlinga vår av opplysningane er ulovleg. Det
                same gjeld dersom du meiner at vi ikkje treng opplysningane.
            </BodyLong>

            <Heading size="large" level="2" spacing id="cookies">
                Informasjonskapslar
            </Heading>
            <BodyLong className="mb-12">
                Arbeidsplassen.no er eit subdomene av nav.no. Vi lagrar ikkje personopplysningar om deg på dei
                opne/ikkje innlogga sidene på arbeidsplassen.nav.no, men bruker informasjonskapslar («cookiar»).{" "}
                <AkselLink as={NextLink} href="/informasjonskapsler">
                    Les meir om informasjonskapslar på arbeidsplassen.no.
                </AkselLink>
            </BodyLong>

            <Heading size="large" level="2" id={"skyra"} spacing>
                Brukarundersøkingar (Skyra)
            </Heading>
            <BodyLong className="mb-6">
                Vi bruker <strong>Skyra</strong> til å vise korte spørjeundersøkingar på arbeidsplassen.no for å
                forbetre innhald, navigasjon og brukaroppleving. Undersøkingar er frivillige, og vi ber om at du ikkje
                oppgir personopplysningar i fritekst.
            </BodyLong>
            <List aria-label="Hvordan viser vi undersøkelser?">
                <ListItem>
                    <strong>Utan informasjonskapslar (cookieless)</strong>: Om du ikkje samtykkjer til Skyra-cookiar,
                    kan vi framleis tilby enkelte undersøkingar som <strong>ikkje blir automatisk viste</strong>. Dei
                    blir først opna når du sjølv trykkjer på ein knapp eller lenkje (til dømes «Skriv ei kort
                    tilbakemelding»). I cookieless-modus blir ingen Skyra-cookiar sette, og popup-undersøkelser som
                    elles ville dukka opp automatisk, er deaktiverte.
                </ListItem>
                <ListItem>
                    <strong>Med informasjonskapslar</strong>: Dersom du samtykkjer til “Brukarundersøkingar (Skyra)”,
                    kan vi vise popup-undersøkelser som hugsar om du har svart/lukka, ved bruk av førsteparts
                    funksjonelle cookiar (<mark>skyra.state</mark> og <mark>skyra.&lt;survey-slug&gt;</mark>). Varigheit
                    og formål er beskrive i cookie-oversikta vår.
                </ListItem>
            </List>
            <Heading size="medium" level="3" spacing>
                Kva opplysningar blir behandla?
            </Heading>
            <BodyLong className="mb-12">
                I tillegg til svara du vel å sende inn, registrerer Skyra teknisk einingsinformasjon for å sikre rett
                visning, kvalitet og måling (m.a. nettlesar/versjon, operativsystem, einingstype, by-nivå lokasjon
                basert på anonymisert IP, nettverkstype og URL). Data blir lagra i EU/EØS. Sjå også{" "}
                <AkselLink href="https://www.skyra.no/no/personvern">Skyras personvernerklæring</AkselLink>.
            </BodyLong>

            <Heading className="mb-8" size="large" level="2" id="personalData">
                Les meir om korleis vi behandlar personopplysningane dine
            </Heading>
            <LinkPanel as={NextLink} href="/personvern-arbeidsgiver" className="arb-link-panel-tertiary">
                <LinkPanelTitle className="navds-link-panel__title navds-heading--small">
                    For deg som representerer ein arbeidsgivar
                </LinkPanelTitle>
            </LinkPanel>
        </ArticleWrapper>
    );
}
