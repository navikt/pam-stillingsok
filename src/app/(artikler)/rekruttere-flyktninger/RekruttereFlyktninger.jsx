import { BodyLong, Heading, Link as AkselLink } from "@navikt/ds-react";

export default function RekruttereFlyktninger() {
    return (
        <article className="container-small mt-5 mb-24">
            <Heading size="large" level="1" spacing>
                Ønsker du å rekruttere flyktninger?
            </Heading>
            <BodyLong spacing>
                Alle flyktninger med skriftlig vedtak om opphold- og arbeidstillatelse fra UDI kan starte i arbeid.
            </BodyLong>
            <BodyLong spacing>
                Vi anbefaler å <AkselLink href="/stillingsregistrering/stillingsannonser">lyse ut stillinger</AkselLink>{" "}
                på arbeidsplassen.no. Tjenesten er gratis.
            </BodyLong>
            <BodyLong spacing>
                Husk å informere om språkkrav for stillingen og skrive annonsen på engelsk hvis det er arbeidsspråket.
            </BodyLong>
            <BodyLong spacing>
                <AkselLink href="https://www.nav.no/arbeidsgiver/rekruttere-flyktninger">
                    NAVs råd for deg som ønsker å komme i kontakt med kvalifiserte kandidater
                </AkselLink>
            </BodyLong>
            <BodyLong>
                <AkselLink href="https://www.imdi.no/mangfold-i-arbeidslivet/">
                    Les om hvordan mangfold i arbeidslivet kan bidra til innovasjon, vekst og verdiskaping på imdi.no
                </AkselLink>
            </BodyLong>
        </article>
    );
}
