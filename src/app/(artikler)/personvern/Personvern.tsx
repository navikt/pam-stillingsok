import { BodyLong, Heading, Link as AkselLink, List } from "@navikt/ds-react";
import { LinkPanel, LinkPanelTitle } from "@navikt/ds-react/LinkPanel";
import NextLink from "next/link";
import { ListItem } from "@navikt/ds-react/List";

export default function Personvern() {
    return (
        <article className="container-small mt-5 mb-24">
            <Heading size="xlarge" level="1" spacing>
                Personvernerklæring for arbeidsplassen.no
            </Heading>
            <BodyLong className="mb-8">Sist oppdatert oktober 2025</BodyLong>
            <BodyLong spacing>
                Arbeidsplassen.no er en tjeneste fra Nav og det er Arbeids- og velferdsdirektoratet som er
                behandlingsansvarlig for dine data her. Denne personvernerklæringen er knyttet til behandlingen av
                personopplysninger særskilt for tjenestene på arbeidsplassen.no.
            </BodyLong>
            <BodyLong spacing>
                Vi lagrer kun personopplysninger i de innloggede tjenestene og ved innhenting av stillingsannonser fra
                arbeidsgivere via våre samarbeidspartnere. For utfyllende informasjon om hvordan Nav behandler dine
                personopplysninger, kan du lese mer i{" "}
                <AkselLink href="https://www.nav.no/personvernerklaering">
                    Navs generelle personvernerklæring.
                </AkselLink>
            </BodyLong>
            <BodyLong spacing>
                For deg som representerer en arbeidsgiver, les mer lenger nede på siden om hvordan vi behandler dine
                personopplysninger i løsningen.
            </BodyLong>
            <BodyLong className="mb-12">
                <AkselLink as={NextLink} href="/personvern-superrask-soknad">
                    Informasjon om hvordan vi behandler dine data knyttet til superrask søknad.
                </AkselLink>
            </BodyLong>

            <Heading size="large" level="2" spacing>
                Innhold
            </Heading>
            <ul aria-label="Innhold på siden" className="mb-12">
                <li>
                    <BodyLong>
                        <AkselLink href="#information">Hvilke personopplysninger samler vi inn?</AkselLink>
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        <AkselLink href="#goals">Hvilke formål brukes personopplysningene til?</AkselLink>
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        <AkselLink href="#time">Hvor lenge lagres opplysningene?</AkselLink>
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        <AkselLink href="#legal">
                            Hva er det rettslige grunnlaget for behandlingen av personopplysninger?
                        </AkselLink>
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        <AkselLink href="#who">Hvem deles opplysningene med?</AkselLink>
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        <AkselLink href="#rights">Hvilke rettigheter har du?</AkselLink>
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        <AkselLink href="#cookies">Informasjonskapsler</AkselLink>
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
                            Les mer om hvordan vi behandler dine personopplysninger
                        </AkselLink>
                    </BodyLong>
                </li>
            </ul>

            <Heading size="large" level="2" spacing id="information">
                Hvilke personopplysninger samler vi inn?
            </Heading>
            <BodyLong>Når du tar i bruk innloggede tjenester på arbeidsplassen.no, innhenter vi:</BodyLong>
            <ul aria-label="Når du tar i bruk innloggede tjenester på arbeidsplassen.no, innhenter vi">
                <li>
                    <BodyLong>Navn</BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Fødselsnummer - for å se om du er under 15 år. Man får ikke tilgang om man er under 15 år.
                        Informasjonen lagres ikke.
                    </BodyLong>
                </li>
            </ul>
            <BodyLong spacing>
                Når du er innlogget kan du ta i bruk funksjonen Favoritter – hvor du kan lagre stillinger du er
                interessert i.
            </BodyLong>
            <BodyLong spacing>
                For å kunne ta i bruk funksjonen Lagrede søk, legger du inn din e-postadresse. Da kan du definere og
                lagre søk og motta varsel på e-post når det kommer aktuelle stillinger.
            </BodyLong>
            <BodyLong className="mb-12">
                Du velger selv om funksjonen Lagrede søk skal være aktiv 30, 60 eller 90 dager. Vi sender deg en e-post
                7 dager før det går ut for å høre om du vil fortsette å lagre søket. Vi lagrer din e-post til du sletter
                den på Min side.
            </BodyLong>

            <Heading size="large" level="2" spacing id="goals">
                Hvilke formål brukes personopplysningene til?
            </Heading>
            <Heading size="medium" level="3" spacing>
                Velfungerende arbeidsmarked
            </Heading>
            <BodyLong spacing>
                Arbeidsplassen.no skal bidra til et velfungerende arbeidsmarked gjennom en åpen plattform for
                arbeidsmarkedet. Vi lagrer og behandler personopplysninger for å gjøre det enklere for jobbsøkere å
                finne jobb og for arbeidsgivere å skaffe arbeidskraft. Dette er i tråd med Navs samfunnsoppdrag om å få
                flere i arbeid.
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Statistikk og kunnskap om arbeidsmarkedet
            </Heading>
            <BodyLong className="mb-12">
                Nav benytter opplysningene fra arbeidsplassen.no til å utvikle statistikk og kunnskap om
                arbeidsmarkedet. Les mer i{" "}
                <AkselLink href="https://www.nav.no/personvernerklaering#statistikk">
                    Navs generelle personvernerklæring.
                </AkselLink>
            </BodyLong>

            <Heading size="large" level="2" spacing id="time">
                Hvor lenge lagres opplysningene?
            </Heading>
            <BodyLong className="mb-12">
                Opplysningene lagres inntil du sletter dem hos oss. Nav behandler også opplysninger for
                statistikkformål.
            </BodyLong>

            <Heading size="large" level="2" spacing id="legal">
                Hva er det rettslige grunnlaget for behandlingen av personopplysninger?
            </Heading>
            <Heading size="medium" level="3" spacing>
                Samtykke
            </Heading>
            <BodyLong className="mb-12">
                Når du tar i bruk og legger informasjon inn på innloggede tjenester på arbeidsplassen.no, samtykker du
                til at vi kan behandle personopplysninger om deg. Du kan selv velge hvilke tjenester du vil samtykke til
                at vi behandler personopplysninger for. Du kan når som helst trekke ditt samtykke.
            </BodyLong>

            <Heading size="large" level="2" spacing id="who">
                Hvem deles opplysningene med?
            </Heading>
            <Heading size="medium" level="3" spacing>
                Våre databehandlere
            </Heading>
            <BodyLong className="mb-12">
                For å kunne tilby våre tjenester på arbeidsplassen.no benytter vi databehandlere, som innebærer at vi
                deler dine personopplysninger med disse. Dette gjelder for eksempel IT-leverandører som har avtaler med
                Nav. For å lese mer om dette, se{" "}
                <AkselLink href="https://www.nav.no/personvernerklaering#hvem">
                    Navs generelle personvernerklæring.
                </AkselLink>
            </BodyLong>

            <Heading size="large" level="2" spacing id="rights">
                Hvilke rettigheter har du?
            </Heading>
            <Heading size="medium" level="3" spacing>
                Rett til innsyn og retting
            </Heading>
            <BodyLong spacing>
                Du har rett til å få vite hvilke personopplysninger vi har om deg og be om retting av uriktige
                opplysninger. Du kan logge deg inn på Min side på arbeidsplassen.no for å se mange av opplysningene vi
                har registrert om deg. For innsyn i personopplysninger ut over dette, må du{" "}
                <AkselLink href="https://www.nav.no/personvernerklaering#kontakt-nav">
                    ta kontakt med oss på nav.no.
                </AkselLink>
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Rett til å trekke tilbake samtykke og sletting
            </Heading>
            <BodyLong spacing>
                Når du har samtykket til en behandling, kan du til enhver tid trekke tilbake dine samtykker. Dette gjør
                du ved gå til «innstillinger». Der kan du administrere dine samtykker, og slette dem om du ønsker.
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Rett til dataportabilitet
            </Heading>
            <BodyLong spacing>
                Du har rett til å be oss om å overføre opplysninger om deg til deg eller en annen behandlingsansvarlig.
                Dette innebærer en rett til å få utlevert i et maskinlesbart og vanlig brukt filformat dersom du ønsker
                dette. Formålet med dette er at du skal kunne gjenbruke disse opplysningene hos en annen
                behandlingsansvarlig, dersom du ønsker.
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Rett til begrensning av behandlingen
            </Heading>
            <BodyLong className="mb-12">
                Du har rett til å be om at Nav midlertidig stopper behandlingen av dine opplysninger, dersom du mener at
                opplysningene vi har om deg er feil eller du mener at vår behandling av opplysningene er ulovlig. Det
                samme gjelder dersom du mener at vi ikke trenger opplysningene.
            </BodyLong>

            <Heading size="large" level="2" spacing id="cookies">
                Informasjonskapsler
            </Heading>
            <BodyLong className="mb-12">
                Arbeidsplassen.no er et subdomene av nav.no. Vi lagrer ikke personopplysninger om deg på de
                åpne/uinnloggede sidene på arbeidsplassen.nav.no, men bruker informasjonskapsler («cookies»).{" "}
                <AkselLink as={NextLink} href="/informasjonskapsler">
                    Les mer om informasjonskapsler på arbeidsplassen.no.
                </AkselLink>
            </BodyLong>

            <Heading size="large" level="2" id={"skyra"} spacing>
                Brukerundersøkelser (Skyra)
            </Heading>
            <BodyLong className="mb-6">
                Vi bruker <strong>Skyra</strong> til å vise korte spørreundersøkelser på arbeidsplassen.no for å
                forbedre innhold, navigasjon og brukeropplevelse. Undersøkelser er frivillige, og vi ber om at du ikke
                oppgir personopplysninger i fritekst.
            </BodyLong>
            <List aria-label="Hvordan viser vi undersøkelser?">
                <ListItem>
                    <strong>Uten informasjonskapsler (cookieless)</strong>: Hvis du ikke samtykker til Skyra-cookies,
                    kan vi fortsatt tilby enkelte undersøkelser som <strong>ikke vises automatisk</strong>. De åpnes
                    først når du selv trykker på en knapp eller lenke (for eksempel «Skriv en kort tilbakemelding»). I
                    cookieless-modus settes ingen Skyra-cookies, og popup-undersøkelser som ellers ville dukket opp
                    automatisk, er deaktivert.
                </ListItem>
                <ListItem>
                    <strong>Med informasjonskapsler</strong>: Dersom du samtykker til “Brukerundersøkelser (Skyra)”, kan
                    vi vise popup-undersøkelser som husker om du har svart/lukket, ved bruk av førsteparts funksjonelle
                    cookies (<mark>skyra.state</mark> og <mark>skyra.&lt;survey-slug&gt;</mark>). Varighet og formål er
                    beskrevet i vår cookie-oversikt.
                </ListItem>
            </List>
            <Heading size="medium" level="3" spacing>
                Hvilke opplysninger behandles?
            </Heading>
            <BodyLong className="mb-12">
                I tillegg til svarene du velger å sende inn, registrerer Skyra teknisk enhetsinformasjon for å sikre
                riktig visning, kvalitet og måling (bl.a. nettleser/versjon, operativsystem, enhetstype, by-nivå
                lokasjon basert på anonymisert IP, nettverkstype og URL). Data lagres i EU/EØS. Se også{" "}
                <AkselLink href="https://www.skyra.no/no/personvern">Skyras personvernerklæring</AkselLink>.
            </BodyLong>

            <Heading className="mb-8" size="large" level="2" id="personalData">
                Les mer om hvordan vi behandler dine personopplysninger
            </Heading>
            <LinkPanel as={NextLink} href="/personvern-arbeidsgiver" className="arb-link-panel-tertiary">
                <LinkPanelTitle className="navds-link-panel__title navds-heading--small">
                    For deg som representerer en arbeidsgiver
                </LinkPanelTitle>
            </LinkPanel>
        </article>
    );
}
