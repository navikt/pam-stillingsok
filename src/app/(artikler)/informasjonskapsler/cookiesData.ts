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
        purpose: "Huske ditt samtykkevalg",
        duration: "90 dager",
        provider: "arbeidsplassen.no",
        comment: "brukes for å oppdage endringer i samtykke",
        category: "necessary",
    },
    {
        name: "organizationNumber",
        purpose: "Husker valgt bedrift (arbeidsgiver)",
        duration: "30 dager",
        provider: "arbeidsplassen.no",
        comment: "slettes automatisk",
        category: "necessary",
    },
    {
        name: "selvbetjening-idtoken / XSRF-TOKEN-ARBEIDSPLASSEN / sso-nav.no",
        purpose: "Autentisering og CSRF-beskyttelse",
        duration: "Sesjon",
        provider: "arbeidsplassen.no",
        comment: "slettes når du logger ut",
        category: "necessary",
    },
    {
        name: "session",
        purpose: "Feilsøking og teknisk stabilitet (Sentry)",
        duration: "Nullstilles daglig",
        provider: "arbeidsplassen.no",
        comment: "slettes når nettleseren lukkes",
        category: "necessary",
    },
] as const;

export const OPTIONAL_COOKIES: ReadonlyArray<CookieItem> = [
    {
        name: "skyra.state",
        purpose:
            "Husker enheten slik at undersøkelser kan oppføre seg riktig (f.eks. ikke vises på nytt etter at du har svart/lukket).",
        duration: "Inntil 365 dager",
        provider: "skyra.no",
        comment: "Kun når du har samtykket til Skyra-cookies",
        category: "optional",
    },
    {
        name: "skyra.<survey-slug>",
        purpose:
            "Midlertidig lagring mens du svarer; brukes for å vise riktig steg/innhold. Slettes når undersøkelsen lukkes/fullføres (kan være sesjonsbasert eller få timer).",
        duration: "Sesjon / få timer",
        provider: "skyra.no",
        comment: "Kun når du har samtykket til Skyra-cookies",
        category: "optional",
    },
] as const;
