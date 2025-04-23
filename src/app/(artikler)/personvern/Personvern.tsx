import { BodyLong, Heading, Link as AkselLink } from "@navikt/ds-react";
import { LinkPanel, LinkPanelTitle, LinkPanelDescription } from "@navikt/ds-react/LinkPanel";
import NextLink from "next/link";

export default function Personvern() {
    return (
        <article className="container-small mt-5 mb-24">
            <Heading size="xlarge" level="1" spacing>
                Personvernerklæring for arbeidsplassen.no
            </Heading>
            <BodyLong className="mb-8">Publisert 1. februar 2022</BodyLong>

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
                <AkselLink href="https://www.nav.no/personvern-sikkerhet-navno">
                    Les mer om informasjonskapsler og innloggede tjenester på nav.no.
                </AkselLink>
            </BodyLong>

            <Heading className="mb-8" size="large" level="2">
                Les mer om hvordan vi behandler dine personopplysninger
            </Heading>
            <LinkPanel as={NextLink} href="/personvern-under-oppfolging" className="arb-link-panel-tertiary mb-4">
                <LinkPanelTitle className="navds-link-panel__title navds-heading--small">
                    For deg som er under arbeidsrettet oppfølging fra Nav
                </LinkPanelTitle>
                <LinkPanelDescription className="navds-link-panel__description navds-body-long">
                    Dersom du har registrert deg som arbeidssøker hos Nav, gjelder dette deg.
                </LinkPanelDescription>
            </LinkPanel>
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
