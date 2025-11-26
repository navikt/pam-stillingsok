import { ArticleCategory, ArticleLanguage } from "@/app/(artikler)/pageInfoTypes";
import { SiteMapEntry } from "@/app/(artikler)/buildSiteMap";

export type WorkInNorwayLocale = "en" | "ru" | "uk";

/**
 * Disse med dynamisk language i url må settes opp manuelt.
 * fant ingen nice automatisk måte å generere disse på per nå
 */
export type WorkInNorwayPageId =
    | "work-in-norway"
    | "work-in-norway/applying-for-job"
    | "work-in-norway/finding-a-job"
    | "work-in-norway/starting-a-new-job"
    | "work-in-norway/unemployed";

export const WORK_IN_NORWAY_LOCALES: readonly WorkInNorwayLocale[] = ["en", "ru", "uk"] as const;

export type WorkInNorwayPageConfig = {
    readonly id: WorkInNorwayPageId;
    readonly title: string;
    readonly category: ArticleCategory;
    /**
     * Nøkkel i translations-fila (valgfritt, men kan brukes i nettstedkartet)
     */
    readonly titleKey?: string;
    readonly languages: readonly WorkInNorwayLocale[];
};

export const WORK_IN_NORWAY_PAGES: readonly WorkInNorwayPageConfig[] = [
    {
        id: "work-in-norway",
        title: "Information about working in Norway for Ukrainian refugees",
        category: "jobseeker-guides",
        titleKey: "frontpage-title",
        languages: ["en"],
    },
    {
        id: "work-in-norway/applying-for-job",
        title: "Applying for a job",
        category: "jobseeker-guides",
        titleKey: "applying-for-job-title",
        languages: ["en"],
    },
    {
        id: "work-in-norway/finding-a-job",
        title: "Finding a job",
        category: "jobseeker-guides",
        titleKey: "finding-a-job-title",
        languages: ["en"],
    },
    {
        id: "work-in-norway/starting-a-new-job",
        title: "Starting a new job",
        category: "jobseeker-guides",
        titleKey: "starting-a-new-job-title",
        languages: ["en"],
    },
    {
        id: "work-in-norway/unemployed",
        title: "Unemployed",
        category: "jobseeker-guides",
        titleKey: "unemployed-title",
        languages: ["en"],
    },
];

export function buildWorkInNorwaySiteMapEntries(options?: {
    readonly basePath?: string;
    readonly includeLanguages?: readonly ArticleLanguage[];
}): readonly SiteMapEntry[] {
    const basePath = options?.basePath ?? "";
    const includeLanguages = options?.includeLanguages;

    const entries: SiteMapEntry[] = [];

    for (const page of WORK_IN_NORWAY_PAGES) {
        for (const language of page.languages) {
            if (includeLanguages != null && !includeLanguages.includes(language)) {
                continue;
            }

            const href = `${basePath}/${language}/${page.id}`.replace(/\/+/g, "/");

            entries.push({
                href,
                title: page.title,
                category: page.category,
                language,
            });
        }
    }

    return entries;
}
