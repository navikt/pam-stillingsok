import type { ArticleCategory } from "../pageInfoTypes";

export type SiteMapCategoryConfig = {
    readonly id: ArticleCategory;
    readonly heading: string;
    readonly description?: string;
};

export const NETTSTEDKART_KATEGORIER: readonly SiteMapCategoryConfig[] = [
    {
        id: "jobseeker-guides",
        heading: "Veiledning for jobbsøkere",
        description: "Artikler og guider som hjelper deg å søke jobb.",
    },
    {
        id: "employer-guides",
        heading: "Veiledning for arbeidsgivere",
        description: "Artikler om rekruttering, annonsering og tilgangsstyring.",
    },
    {
        id: "superrask-soknad",
        heading: "Superrask søknad",
        description: "Informasjon om superrask søknad for arbeidsgivere og jobbsøkere.",
    },
    {
        id: "search-and-features",
        heading: "Søk og funksjoner",
        description: "Artikler om søkesiden og nye funksjoner på arbeidsplassen.no.",
    },
    {
        id: "privacy-and-terms",
        heading: "Personvern og vilkår",
        description: "Personvernerklæringer, vilkår og retningslinjer.",
    },
    {
        id: "api-and-integrations",
        heading: "API og integrasjoner",
        description: "Teknisk info om API-er og integrasjoner.",
    },
    {
        id: "about-service",
        heading: "Om arbeidsplassen.no",
        description: "Bakgrunnsinformasjon om tjenesten.",
    },
    {
        id: "support-and-contact",
        heading: "Støtte og kontakt",
        description: "Kontaktinformasjon og spørsmål/svar.",
    },
] as const;
