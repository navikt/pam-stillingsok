export type CookieCategory = "necessary" | "analytics";

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
