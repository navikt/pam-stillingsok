export type ArticleLanguage = "nb" | "nn" | "en" | "ru" | "uk";

export type ArticleCategory =
    | "jobseeker-guides"
    | "employer-guides"
    | "superrask-soknad"
    | "search-and-features"
    | "privacy-and-terms"
    | "api-and-integrations"
    | "about-service"
    | "support-and-contact"
    | "auth-flow"
    | "work-in-norway";

export type PageInfo = {
    readonly title: string; // visning i artikkel (kan ha soft hyphen)
    readonly metaTitle?: string; // valgfri egen tittel for <title>/OG
    readonly language: ArticleLanguage;
    readonly proofread: boolean;
    readonly category: ArticleCategory;
    readonly description?: string;
    readonly updatedAt?: string; // ISO-dato, f.eks. "2025-11-23"
    /**
     * Relativ eller absolutt sti til delingsbilde.
     * Eksempel: "/og-images/arbeidsgivertjenester.png"
     */
    readonly ogImagePath?: string;
    readonly excludeFromSiteMap?: boolean;
};
export type ArticleConfig = Record<string, PageInfo>;

export function mapLocaleToLanguage(locale: string): PageInfo["language"] {
    if (locale === "en" || locale === "ru" || locale === "uk" || locale === "nb" || locale === "nn") {
        return locale;
    }

    return "nb";
}
