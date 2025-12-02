export type CookieCategory = "necessary" | "analytics" | "optional";

export type CookieType = "first-party" | "third-party";

export type CookieItem = Readonly<{
    name: string;
    purpose: string; // kort, én setning
    duration: string; // "Sesjon" | "30 dager" | "90 dager"
    provider?: string; // f.eks. "arbeidsplassen.no"
    type?: CookieType; // default "first-party"
    category: CookieCategory; // "necessary" | "analytics"
    comment?: string; // valgfri presisering
}>;

export const NECESSARY_COOKIES: ReadonlyArray<CookieItem> = [
    {
        name: "arbeidsplassen-consent",
        purpose: "Huske ditt samtykkeval",
        duration: "90 dagar",
        provider: "arbeidsplassen.no",
        comment: "blir brukt for å oppdaga endringar i samtykke",
        category: "necessary",
    },
    {
        name: "organizationNumber",
        purpose: "Hugsar vald bedrift (arbeidsgivar)",
        duration: "30 dagar",
        provider: "arbeidsplassen.no",
        comment: "blir automatisk sletta",
        category: "necessary",
    },
    {
        name: "selvbetjening-idtoken / XSRF-TOKEN-ARBEIDSPLASSEN / sso-nav.no",
        purpose: "Autentisering og CSRF-vern",
        duration: "Sesjon",
        provider: "arbeidsplassen.no",
        comment: "blir sletta når du loggar ut",
        category: "necessary",
    },
    {
        name: "session",
        purpose: "Feilsøking og teknisk stabilitet (Sentry)",
        duration: "Blir nullstilt dagleg",
        provider: "arbeidsplassen.no",
        comment: "blir sletta når nettlesaren blir lukka",
        category: "necessary",
    },
] as const;

export const OPTIONAL_COOKIES: ReadonlyArray<CookieItem> = [
    {
        name: "skyra.state",
        purpose:
            "Hugsar eininga slik at undersøkingar kan oppføra seg rett (t.d. ikkje blir viste på nytt etter at du har svart/lukka).",
        duration: "Inntil 365 dagar",
        provider: "skyra.no",
        comment: "Berre når du har samtykt til Skyra-cookiar",
        category: "optional",
    },
    {
        name: "skyra.<survey-slug>",
        purpose:
            "Midlertidig lagring medan du svarer; blir brukt for å visa rett steg/innhald. Blir sletta når undersøkinga blir lukka/fullført (kan vera sesjonsbasert eller få timar).",
        duration: "Sesjon / få timar",
        provider: "skyra.no",
        comment: "Berre når du har samtykt til Skyra-cookiar",
        category: "optional",
    },
] as const;
