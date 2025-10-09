"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { Box, BodyLong, Heading, Link as AkselLink, List, Button, HGrid, Switch } from "@navikt/ds-react";
import NextLink from "next/link";
import CookieBannerContext, { CookieBannerContextType } from "@/app/_common/cookie-banner/CookieBannerContext";
import { ConsentValues, getConsentValues, getUserActionTakenValue, updateConsent } from "@navikt/arbeidsplassen-react";
import { onConsentChanged } from "@/app/_common/umami";
import { CookiesResponsive } from "@/app/(artikler)/informasjonskapsler/CookiesResponsive";
import { NECESSARY_COOKIES } from "@/app/(artikler)/informasjonskapsler/cookiesData";

interface InformasjonskapslerProps {
    consentValues: ConsentValues;
    userActionTaken: boolean | null;
}

const useCookieBanner = (): CookieBannerContextType => {
    const context = useContext(CookieBannerContext);
    if (context === undefined) {
        throw new Error("useCookieBanner must be used within a CookieBannerProvider");
    }
    return context;
};

function Informasjonskapsler({ consentValues, userActionTaken }: InformasjonskapslerProps) {
    const { showCookieBanner, openCookieBanner } = useCookieBanner();
    const openCookieBannerButtonRef = useRef<HTMLButtonElement>(null);
    const [useAriaLive, setUseAriaLive] = useState<boolean>(false);
    const [localConsentValues, setLocalConsentValues] = useState<ConsentValues>(consentValues);
    const [localUserActionTaken, setLocalUserActionTaken] = useState<boolean | null>(userActionTaken);

    const handleCookieOpenBanner = () => {
        if (openCookieBannerButtonRef.current) {
            openCookieBanner(openCookieBannerButtonRef.current);
            setUseAriaLive(true);
        }
    };

    useEffect(() => {
        if (!showCookieBanner) {
            setLocalConsentValues(getConsentValues());
            setLocalUserActionTaken(getUserActionTakenValue());
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
                                    (!localConsentValues?.analyticsConsent
                                        ? "Du har godtatt bare nødvendige informasjonskapsler"
                                        : "Du har godtatt valgfrie informasjonskapsler")}
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
                        Informasjonskapsler (cookies og lignende teknologier) er små datafiler som lagres på enheten din
                        når du benytter nettsiden vår. Noen av dem er nødvendige for at nettsiden skal fungere korrekt
                        (f.eks. huske pålogging, sikkerhet, navigasjon), mens andre brukes til analyse og statistikk for
                        å forbedre tjenestene våre og brukeropplevelsen på siden. Bruken av informasjonskapsler
                        reguleres av{" "}
                        <AkselLink href="https://lovdata.no/dokument/NL/lov/2024-12-13-76/KAPITTEL_3#%C2%A73-15">
                            e-kom­loven § 3-15
                        </AkselLink>{" "}
                        og personvernregelverket (GDPR).
                    </BodyLong>

                    <BodyLong spacing>
                        Ønsker du informasjon om hvordan vi behandler personopplysninger?{" "}
                        <AkselLink as={NextLink} href="/personvern">
                            Les personvernerklæringen vår
                        </AkselLink>
                        .
                    </BodyLong>

                    <Heading size="large" level="2" spacing>
                        Administrer samtykke
                    </Heading>

                    <BodyLong spacing>
                        Du kan når som helst endre innstillingene dine for informasjonskapsler. De nødvendige
                        informasjonskapslene settes alltid og kan ikke skrus av. For valgfrie kan du skru analyse og
                        statistikk (Umami) av/på:
                    </BodyLong>

                    <Switch
                        onChange={(e) => {
                            updateConsent({
                                userActionTaken: true,
                                consent: {
                                    analytics: e.target.checked,
                                },
                            });
                            onConsentChanged();
                            setLocalConsentValues((next) => {
                                return { ...next, analyticsConsent: e.target.checked };
                            });
                        }}
                        checked={localConsentValues?.analyticsConsent ?? false}
                        description="Samler anonymisert statistikk om hvordan arbeidsplassen.no brukes.
               Hjelper oss å forstå hvilke sider som besøkes og forbedre tjenesten.
               Dataene deles ikke med reklamenettverk."
                    >
                        Analyse og statistikk (Umami)
                    </Switch>
                    <BodyLong spacing className="mt-4">
                        Valgene dine lagres i en informasjonskapsel (arbeidsplassen-consent) i 90 dager.
                    </BodyLong>

                    <Heading size="large" level="2" spacing>
                        Nødvendige informasjonskapsler (alltid på)
                    </Heading>
                    <BodyLong spacing>
                        Disse er essensielle for at arbeidsplassen.no kan fungere og levere grunnleggende tjenester
                        (pålogging, sikkerhet og tekniske innstillinger).
                    </BodyLong>

                    <CookiesResponsive cookies={NECESSARY_COOKIES} />

                    <div className="horizontal-line mb-12" />

                    <Heading size="large" level="2" spacing id="custom-cookie-heading">
                        Valgfrie informasjonskapsler (analyse og undersøkelser)
                    </Heading>
                    <BodyLong spacing>Disse settes kun dersom du gir samtykke.</BodyLong>
                    <Heading size="medium" level="3" spacing>
                        Analyse og statistikk (Umami)
                    </Heading>
                    <List aria-label="Hva bruker vi umami til">
                        <List.Item>
                            Vi bruker <strong>Umami</strong> til å samle inn anonymisert statistikk om hvordan
                            arbeidsplassen.no blir brukt.
                        </List.Item>
                        <List.Item>
                            IP-adresser maskeres, og data deles ikke med reklamenettverk eller eksterne aktører for
                            markedsføring.
                        </List.Item>
                        <List.Item>
                            Informasjonen hjelper oss å forstå hvilke sider som brukes, hvor lenge, og hvilke funksjoner
                            som er mest nyttige.
                        </List.Item>
                    </List>
                    <BodyLong spacing>Du kan skru Umami av/på i innstillingene øverst på siden.</BodyLong>
                    <Heading size="medium" level="3" spacing>
                        Undersøkelser uten informasjonskapsler (Skyra)
                    </Heading>
                    <BodyLong spacing>
                        Vi kan av og til invitere deg til korte undersøkelser via verktøyet <strong>Skyra</strong> for å
                        forstå hvordan arbeidsplassen.no oppleves.
                    </BodyLong>
                    <BodyLong spacing>
                        Skyra er satt opp i <strong>cookie-fri modus</strong> hos oss. Det betyr at det{" "}
                        <strong>ikke lagres</strong> informasjonskapsler i nettleseren din, og derfor styres dette{" "}
                        <strong>ikke</strong> av innstillingene du gjør i samtykkebanneret. Behandlingsgrunnlag og
                        hvilke opplysninger som behandles finner du i{" "}
                        <AkselLink as={NextLink} href="/personvern#skyra">
                            personvernerklæringen vår
                        </AkselLink>
                        .
                    </BodyLong>
                    <BodyLong spacing>
                        Deltakelse er frivillig, og svarene brukes kun til å forbedre tjenesten – ikke til
                        markedsføring.
                    </BodyLong>

                    <BodyLong spacing>
                        Hvis du velger å ikke akseptere disse informasjonskapslene, vil kjernetjenestene på
                        arbeidsplassen.no fungere som normalt, men du vil ikke bidra til statistikk og kan heller ikke
                        bli invitert til undersøkelser.
                    </BodyLong>

                    <div className="horizontal-line mb-12" />

                    <Heading size="medium" level="2" spacing>
                        Obs / annet
                    </Heading>
                    <BodyLong spacing>
                        Arbeidsplassen.no er en del av NAV og kan derfor inkludere informasjonskapsler fra nav.no. Vil
                        du vite mer om hvordan NAV håndterer informasjonskapsler,
                        <AkselLink href="https://www.nav.no/informasjonskapsler">
                            se informasjon om informasjonskapsler på nav.no
                        </AkselLink>
                        .
                    </BodyLong>
                    <BodyLong>
                        Du kan når som helst endre innstillingene dine for informasjonskapsler via «Endre samtykke»
                        eller via personvernerklæringen vår.
                    </BodyLong>
                </div>
            </div>
        </article>
    );
}

export default Informasjonskapsler;
