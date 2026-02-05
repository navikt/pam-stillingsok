"use client";

import { useEffect, useRef, useState } from "react";
import { Box, BodyLong, Heading, List, Button, HGrid, Link } from "@navikt/ds-react";
import { useCookieBannerContext } from "@/app/_common/cookie-banner/CookieBannerContext";
import { ConsentValues, getConsentValues, getUserActionTakenValue } from "@navikt/arbeidsplassen-react";
import { CookiesResponsive } from "@/app/(artikler)/informasjonskapsler/CookiesResponsive";
import { NECESSARY_COOKIES, OPTIONAL_COOKIES } from "@/app/(artikler)/informasjonskapsler/cookiesData";
import SkyraToggle from "@/app/(artikler)/informasjonskapsler/SkyraToggle";
import UmamiToggle from "@/app/(artikler)/informasjonskapsler/UmamiToggle";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";

interface InformasjonskapslerProps {
    consentValues: ConsentValues;
    userActionTaken: boolean | null;
    readonly meta: PageInfo;
}

function Informasjonskapsler({ consentValues, userActionTaken, meta }: InformasjonskapslerProps) {
    const { showCookieBanner, openCookieBanner } = useCookieBannerContext();
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

    const getConsentMessage = (
        values: ConsentValues | null | undefined,
        userActionTaken: boolean | null,
    ): string | null => {
        if (!userActionTaken || !values) return "Du har ikkje gjort eit val om informasjonskapslar";

        const { analyticsConsent, skyraConsent } = values;

        if (analyticsConsent && skyraConsent) {
            return "Du har godteke valfrie informasjonskapslar";
        }
        if (analyticsConsent || skyraConsent) {
            return analyticsConsent
                ? "Du har godteke analyse og statistikk (Umami), men ikkje brukarundersøkingar (Skyra)"
                : "Du har godteke brukarundersøkingar (Skyra), men ikkje analyse og statistikk (Umami)";
        }
        return "Du har godteke berre nødvendige informasjonskapslar";
    };
    return (
        <ArticleWrapper lang={meta.language}>
            <Heading size="xlarge" level="1" spacing>
                {meta.title}
            </Heading>
            <BodyLong size="large" spacing>
                Les om og endra innstillingar for informasjonskapslar på arbeidsplassen.no
            </BodyLong>
            <Box borderRadius="4" className="mb-12 bg-brand-blue-subtle" padding="space-16">
                <HGrid
                    gap="space-16"
                    align="center"
                    columns={{
                        xs: "1",
                        sm: "1",
                        md: "minmax(0, 50%) 1fr",
                    }}
                >
                    <Heading
                        id="arb-cookie-consent-info"
                        level="2"
                        size="small"
                        aria-live={useAriaLive ? "polite" : "off"}
                    >
                        {getConsentMessage(localConsentValues, localUserActionTaken)}
                    </Heading>

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
                    Informasjonskapsler (cookies og liknande teknologiar) er små datafiler som blir lagra på eininga di
                    når du nyttar nettsida vår. Nokre av dei er nødvendige for at nettsida skal fungera korrekt (t.d.
                    hugsa pålogging, tryggleik, navigasjon), medan andre blir brukte til analyse og statistikk for å
                    forbetra tenestene våre og brukaropplevinga på sida. Bruken av informasjonskapslar blir regulert av{" "}
                    <Link href="https://lovdata.no/dokument/NL/lov/2024-12-13-76/KAPITTEL_3#%C2%A73-15">
                        e-kom­lova § 3-15
                    </Link>{" "}
                    og personvernregelverket (GDPR).
                </BodyLong>

                <BodyLong spacing>
                    Ønskjer du informasjon om korleis me behandlar personopplysningar?{" "}
                    <AkselNextLink href="/personvern">Les personvernerklæringa vår</AkselNextLink>.
                </BodyLong>

                <Heading size="large" level="2" spacing>
                    Administrer samtykke
                </Heading>

                <BodyLong spacing>
                    Du kan når som helst endra innstillingane dine for informasjonskapslar. Dei nødvendige
                    informasjonskapslane blir alltid sette og kan ikkje skruast av. For valfrie kan du skru analyse og
                    statistikk (Umami) av/på:
                </BodyLong>

                <UmamiToggle setConsentValues={setLocalConsentValues} checked={localConsentValues?.analyticsConsent} />

                <SkyraToggle setConsentValues={setLocalConsentValues} checked={localConsentValues?.skyraConsent} />

                <BodyLong spacing className="mt-4">
                    Vala dine blir lagra i ein informasjonskapsel (arbeidsplassen-consent) i 90 dagar.
                </BodyLong>

                <Heading size="large" level="2" spacing>
                    Nødvendige informasjonskapslar (alltid på)
                </Heading>
                <BodyLong spacing>
                    Desse er essensielle for at arbeidsplassen.no kan fungera og levera grunnleggjande tenester
                    (pålogging, tryggleik og tekniske innstillingar).
                </BodyLong>

                <CookiesResponsive
                    cookies={NECESSARY_COOKIES}
                    caption="Nødvendige informasjonskapslar brukte på arbeidsplassen.no"
                />

                <div className="horizontal-line mb-12" />

                <Heading size="large" level="2" spacing id="custom-cookie-heading">
                    Valgfrie informasjonskapslar (analyse og undersøkingar)
                </Heading>
                <BodyLong spacing>Desse blir berre sett dersom du gir samtykke.</BodyLong>

                <Heading size="medium" level="3" spacing>
                    Analyse og statistikk (Umami)
                </Heading>
                <List aria-label="Hva bruker vi umami til">
                    <List.Item>
                        Me bruker <strong>Umami</strong> til å samla inn anonymisert statistikk om korleis
                        arbeidsplassen.no blir brukte.
                    </List.Item>
                    <List.Item>
                        IP-adresser blir maskerte, og data blir ikkje delte med reklamenettverk eller eksterne aktørar
                        for marknadsføring.
                    </List.Item>
                    <List.Item>
                        Informasjonen hjelper oss å forstå kva sider som blir brukte, kor lenge, og kva funksjonar som
                        er mest nyttige.
                    </List.Item>
                </List>
                <BodyLong spacing>Du kan skru Umami av/på i innstillingane øvst på sida.</BodyLong>
                <Heading size="medium" level="3" spacing>
                    Brukarundersøkingar (Skyra)
                </Heading>
                <BodyLong spacing>
                    Me bruker <strong>Skyra</strong> for å gjennomføra korte spørjeundersøkingar og for å forstå kva som
                    fungerer og kva me bør forbetra på arbeidsplassen.no.
                </BodyLong>

                <List aria-label="Hva bruker vi skyra til">
                    <List.Item>
                        Om du <strong>ikkje</strong> samtykkjer til Skyra-cookiar, kan me framleis visa enkelte
                        undersøkingar <strong>utan</strong> informasjonskapslar (“cookieless”). Då set ein ingen
                        cookiar, og popup-undersøkelser som krev cookiar blir deaktiverte.
                    </List.Item>
                    <List.Item>
                        Om du <strong>samtykkjer</strong> til “Brukarundersøkingar (Skyra)”, kan me visa
                        popup-undersøkelser som hugsar om du har svart/lukka, og Skyra set funksjonelle førsteparts
                        informasjonskapslar (sjå tabellen under).
                    </List.Item>
                    <List.Item>Skyra lagrar data i Europa. Les meir hos leverandøren.</List.Item>
                </List>

                <CookiesResponsive
                    cookies={OPTIONAL_COOKIES}
                    caption="Valfrie informasjonskapslar brukte på arbeidsplassen.no"
                />
                <div className="horizontal-line mb-12" />
                <BodyLong>
                    Du kan endra vala dine når som helst.{" "}
                    <strong>Uansett val deler me aldri dine data med andre.</strong> Behandlingsgrunnlag og kva
                    opplysningar som blir behandla finn du i{" "}
                    <AkselNextLink href="/personvern#skyra">personvernerklæringa vår</AkselNextLink>.
                </BodyLong>
                <BodyLong spacing>
                    Deltaking er frivillig, og svara blir berre brukte til å forbetra tenesta – ikkje til
                    marknadsføring.
                </BodyLong>

                <BodyLong spacing>
                    Om du vel å ikkje akseptera desse informasjonskapslane, vil kjernetenestene på arbeidsplassen.no
                    fungera som normalt, men du vil ikkje bidra til statistikk og kan heller ikkje bli invitert til
                    undersøkingar.
                </BodyLong>

                <div className="horizontal-line mb-12" />

                <Heading size="medium" level="2" spacing>
                    Obs / anna
                </Heading>
                <BodyLong spacing>
                    Arbeidsplassen.no er ein del av Nav og kan derfor inkludera informasjonskapslar frå nav.no. Vil du
                    vite meir om korleis Nav handterer informasjonskapslar,
                    <Link href="https://www.nav.no/informasjonskapsler">
                        sjå informasjon om informasjonskapslar på nav.no
                    </Link>
                    .
                </BodyLong>
                <BodyLong>
                    Du kan når som helst endra innstillingane dine for informasjonskapslar via «Endre samtykke» eller
                    via personvernerklæringa vår.
                </BodyLong>
            </div>
        </ArticleWrapper>
    );
}

export default Informasjonskapsler;
