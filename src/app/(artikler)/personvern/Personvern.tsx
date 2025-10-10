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
            <BodyLong className="mb-6">
                I tillegg til svarene du velger å sende inn, registrerer Skyra teknisk enhetsinformasjon for å sikre
                riktig visning, kvalitet og måling (bl.a. nettleser/versjon, operativsystem, enhetstype, by-nivå
                lokasjon basert på anonymisert IP, nettverkstype og URL). Data lagres i EU/EØS. Se også{" "}
                <AkselLink href="https://www.skyra.no/no/personvern">Skyras personvernerklæring</AkselLink>.
            </BodyLong>

            <Heading className="mb-8" size="large" level="2">
                Les mer om hvordan vi behandler dine personopplysninger
            </Heading>
            <LinkPanel as={NextLink} href="/personvern-ikke-under-oppfolging" className="arb-link-panel-tertiary mb-4">
                <LinkPanelTitle className="navds-link-panel__title navds-heading--small">
                    For deg som ikke er under arbeidsrettet oppfølging fra Nav
                </LinkPanelTitle>
            </LinkPanel>
            <LinkPanel as={NextLink} href="/personvern-arbeidsgiver" className="arb-link-panel-tertiary">
                <LinkPanelTitle className="navds-link-panel__title navds-heading--small">
                    For deg som representerer en arbeidsgiver
                </LinkPanelTitle>
            </LinkPanel>
        </article>
    );
}
