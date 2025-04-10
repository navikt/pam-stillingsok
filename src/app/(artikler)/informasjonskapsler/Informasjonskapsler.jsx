"use client";
import { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Box, BodyLong, Heading, Link as AkselLink, List, Button, HGrid } from "@navikt/ds-react";
import NextLink from "next/link";
import CookieBannerContext from "@/app/_common/contexts/CookieBannerContext";
import { CookieBannerUtils } from "@navikt/arbeidsplassen-react";

function Informasjonskapsler({ consentValues, userActionTaken }) {
    const { showCookieBanner, openCookieBanner } = useContext(CookieBannerContext);
    const openCookieBannerButtonRef = useRef(null);
    const [useAriaLive, setUseAriaLive] = useState(false);
    const [localConsentValues, setLocalConsentValues] = useState(consentValues);
    const [localUserActionTaken, setLocalUserActionTaken] = useState(userActionTaken);

    const handleCookieOpenBanner = () => {
        openCookieBanner(openCookieBannerButtonRef.current);
        setUseAriaLive(true);
    };

    useEffect(() => {
        if (!showCookieBanner) {
            setLocalConsentValues(CookieBannerUtils.getConsentValues());
            setLocalUserActionTaken(CookieBannerUtils.getUserActionTakenValue());
        }
    }, [showCookieBanner]);

    return (
        <article className="container-small">
            <div>
                <div className="mt-5 mb-12">
                    <Heading size="xlarge" level="1" spacing>
                        Informasjons&shy;kapsler på arbeidsplassen.no
                    </Heading>

                    <BodyLong size="large" spacing>
                        Les om og endre innstillinger for informasjonskapsler på arbeidsplassen.no
                    </BodyLong>
                </div>

                <Box borderRadius="medium" className="mb-12" padding="4" background="surface-alt-2-subtle">
                    <HGrid
                        gap="4"
                        align="center"
                        columns={{
                            xs: "1",
                            sm: "1",
                            md: "minmax(0, 50%) 1fr",
                        }}
                    >
                        <div>
                            <Heading
                                id="arb-cookie-consent-info"
                                level="2"
                                size="small"
                                aria-live={useAriaLive ? "polite" : "off"}
                            >
                                {!localUserActionTaken && "Du har ikke gjort et valg om informasjonskapsler"}
                                {localUserActionTaken &&
                                    localConsentValues?.analyticsConsent &&
                                    "Du har godtatt valgfrie informasjonskapsler"}
                                {localUserActionTaken &&
                                    !localConsentValues?.analyticsConsent &&
                                    "Du har godtatt bare nødvendige informasjonskapsler"}
                            </Heading>
                        </div>
                        <div className="justfy-end-lg">
                            <Button
                                aria-describedby="arb-cookie-consent-info"
                                className="xs-width-100"
                                ref={openCookieBannerButtonRef}
                                onClick={handleCookieOpenBanner}
                            >
                                Endre samtykket ditt
                            </Button>
                        </div>
                    </HGrid>
                </Box>
                <div className="mb-16">
                    <BodyLong spacing>
                        Informasjonskapsler (cookies og tilsvarende teknologier) er små tekstfiler som lagres på enheten
                        din når du bruker nettsiden vår. De hjelper oss å gi deg en bedre tjeneste ved å huske valgene
                        dine og sikre at alt fungerer, samt gi oss verdifull statistikk som hjelper oss forbedre
                        tjenestene over tid.
                    </BodyLong>

                    <BodyLong spacing>
                        Bruk av informasjonskapsler reguleres i{" "}
                        <AkselLink href="https://lovdata.no/dokument/NL/lov/2024-12-13-76/KAPITTEL_3#%C2%A73-15">
                            ekomloven § 3-15
                        </AkselLink>
                        .
                    </BodyLong>
                    <BodyLong spacing>
                        Ønsker du informasjon om hvordan vi behandler personopplysninger?{" "}
                        <AkselLink as={NextLink} href="/personvern">
                            Les personvernerklæringen vår
                        </AkselLink>
                        .
                    </BodyLong>

                    <Heading size="large" level="2" spacing>
                        Nødvendige informasjonskapsler
                    </Heading>
                    <BodyLong>
                        Noen informasjonskapsler er nødvendige for at arbeidsplassen.no skal fungere best mulig for deg.
                        De:
                    </BodyLong>
                    <List aria-label="Hva gjør nødvendige informasjonskapsler">
                        <List.Item>sikrer at nettsiden fungerer teknisk</List.Item>
                        <List.Item>beskytter sikkerheten din</List.Item>
                        <List.Item>husker valgene dine, så du slipper å starte på nytt hver gang</List.Item>
                    </List>
                    <BodyLong spacing>
                        Under finner du hvilke informasjonskapsler som er nødvendige og hva de gjør. De merket med
                        stjerne (*) inkluderer flere som begynner med samme navn.
                    </BodyLong>

                    <Heading size="xsmall" level="3" spacing>
                        arbeidsplassen-consent *
                    </Heading>
                    <BodyLong spacing>
                        Brukes for å huske dine valg om informasjonskapsler i 90 dager. Versjonen hjelper oss med å
                        avgjøre om det har kommet endringer siden sist du valgte.
                    </BodyLong>

                    <Heading size="xsmall" level="3" spacing>
                        organizationNumber
                    </Heading>
                    <BodyLong spacing>
                        Brukes for å huske hvilken bedrift du representerer når du logger inn som arbeidsgiver. Slettes
                        automatisk etter 30 dager.
                    </BodyLong>

                    <Heading size="xsmall" level="3" spacing>
                        <span className="block">selvbetjening-idtoken</span> <span className="block">sso-nav.no *</span>
                        <span className="block">XSRF-TOKEN-ARBEIDSPLASSEN</span>
                    </Heading>
                    <BodyLong spacing>
                        Brukes for å beskytte deg og tjenestene våre mot angrep. Disse hjelper oss å holde innloggingen
                        din trygg og slettes automatisk når du lukker nettleseren eller logger ut.
                    </BodyLong>

                    <Heading size="xsmall" level="3" spacing>
                        session
                    </Heading>
                    <BodyLong spacing>
                        Brukes sammen med verktøyet Sentry for å oppdage, forstå og fikse tekniske feil raskt.
                        Nullstilles daglig, og slettes når du lukker nettleseren.
                    </BodyLong>

                    <Heading size="xsmall" level="3" spacing>
                        userPreferences
                    </Heading>
                    <BodyLong spacing>
                        Brukes for å huske dine preferanser og gi deg en bedre opplevelse når du søker etter jobber.
                        Slettes automatisk hvis du ikke har besøkt oss på 90 dager.
                    </BodyLong>

                    <Heading size="large" level="2" spacing id="custom-cookie-heading">
                        Valgfrie informasjonskapsler
                    </Heading>
                    <BodyLong spacing>
                        De valgfrie informasjonskapslene hjelper oss med statistikk og analyse for å forbedre tjenestene
                        våre. Vi samler kun inn data som viser hvordan nettsidene brukes – uten å kunne identifisere
                        deg. Vi har strenge sikkerhetstiltak og deler ikke dataene med andre.
                    </BodyLong>
                    <BodyLong spacing>
                        Under finner du de valgfrie informasjonskapslene og hva de gjør. De merket med stjerne (*)
                        inkluderer flere som begynner med samme navn.
                    </BodyLong>

                    <Heading size="xsmall" level="3" spacing>
                        Umami
                    </Heading>
                    <BodyLong spacing>
                        Vi bruker verktøyet Umami for å forstå hvordan nettsiden vår brukes. For å skille deg fra andre
                        brukere lager vi en unik ID basert på informasjon fra nettleseren din – uten
                        informasjonskapsler. Vi beskytter personvernet ditt ved å fjerne deler av IP-adressen din før vi
                        lagrer dataene.
                    </BodyLong>

                    <Heading size="xsmall" level="3" spacing>
                        usertest- *
                    </Heading>
                    <BodyLong className="mb-12">
                        Brukes til frivillige brukerundersøkelser i UX Signals. Informasjonskapslene husker hvilke
                        undersøkelser du eventuelt deltar i.
                    </BodyLong>

                    <div className="horizontal-line mb-12" />

                    <BodyLong>
                        <strong>Merk!</strong> Hvis du har besøkt nav.no, kan du ha fler informasjonskapsler derfra
                        siden arbeidsplassen.no er en del av nav.no. Les mer om{" "}
                        <AkselLink href="https://www.nav.no/informasjonskapsler">
                            informasjonskapsler på nav.no
                        </AkselLink>
                        .
                    </BodyLong>
                </div>
            </div>
        </article>
    );
}

Informasjonskapsler.propTypes = {
    consentValues: PropTypes.shape({
        consent: PropTypes.shape({
            analytics: PropTypes.bool,
            surveys: PropTypes.bool,
        }),
    }),
    userActionTaken: PropTypes.bool,
};

export default Informasjonskapsler;
