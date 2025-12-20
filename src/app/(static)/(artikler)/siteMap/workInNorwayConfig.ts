import { ArticleCategory, ArticleLanguage } from "@/app/(static)/(artikler)/pageInfoTypes";
import { loadTranslations } from "@/app/(static)/(artikler)/[locale]/work-in-norway/_common/getTranslations";
import { getTranslation } from "@/app/(static)/(artikler)/[locale]/work-in-norway/_common/translate";
import { TranslationResult } from "@/app/(static)/(artikler)/[locale]/work-in-norway/_common/types";
import { SiteMapEntry } from "@/app/(static)/(artikler)/siteMap/siteMapTypes";

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
    readonly titleKey: string;
    readonly languages: readonly WorkInNorwayLocale[];
};

export const WORK_IN_NORWAY_PAGES: readonly WorkInNorwayPageConfig[] = [
    {
        id: "work-in-norway",
        title: "Information about working in Norway for Ukrainian refugees",
        category: "jobseeker-guides",
        titleKey: "ukrainian-work-in-norway-title",
        languages: WORK_IN_NORWAY_LOCALES,
    },
    {
        id: "work-in-norway/applying-for-job",
        title: "Applying for a job",
        category: "jobseeker-guides",
        titleKey: "applying-for-a-job-title",
        languages: WORK_IN_NORWAY_LOCALES,
    },
    {
        id: "work-in-norway/finding-a-job",
        title: "Finding a job",
        category: "jobseeker-guides",
        titleKey: "finding-a-job-title",
        languages: WORK_IN_NORWAY_LOCALES,
    },
    {
        id: "work-in-norway/starting-a-new-job",
        title: "Starting a new job",
        category: "jobseeker-guides",
        titleKey: "starting-a-new-job-title",
        languages: WORK_IN_NORWAY_LOCALES,
    },
    {
        id: "work-in-norway/unemployed",
        title: "Unemployed",
        category: "jobseeker-guides",
        titleKey: "unemployed-title",
        languages: WORK_IN_NORWAY_LOCALES,
    },
];

export async function buildWorkInNorwaySiteMapEntries(options?: {
    readonly basePath?: string;
    readonly includeLanguages?: readonly ArticleLanguage[];
}): Promise<readonly SiteMapEntry[]> {
    const basePath = options?.basePath ?? "";
    const includeLanguages = options?.includeLanguages;

    // Hvilke språk vi faktisk skal ta med
    const languagesToUse: readonly ArticleLanguage[] =
        includeLanguages != null && includeLanguages.length > 0
            ? WORK_IN_NORWAY_LOCALES.filter((lang) => includeLanguages.includes(lang))
            : WORK_IN_NORWAY_LOCALES;

    // Preload "work-in-norway"-oversettelser for alle språk vi skal bruke
    const translationsByLanguage: Partial<Record<ArticleLanguage, TranslationResult>> = {};

    for (const language of languagesToUse) {
        translationsByLanguage[language] = await loadTranslations(language, ["work-in-norway"]);
    }

    const entries: SiteMapEntry[] = [];

    for (const page of WORK_IN_NORWAY_PAGES) {
        for (const language of page.languages) {
            if (!languagesToUse.includes(language)) {
                continue;
            }

            const translations = translationsByLanguage[language];
            if (translations == null) {
                continue;
            }

            const { t } = getTranslation(translations);

            const title = t(page.titleKey, { ns: "work-in-norway" });

            const href = `${basePath}/${language}/${page.id}`.replace(/\/+/g, "/");

            entries.push({
                href,
                title,
                category: page.category,
                language,
            });
        }
    }

    return entries.sort((a, b) => a.title.localeCompare(b.title, "nb"));
}
