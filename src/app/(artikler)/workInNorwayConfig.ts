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

export type WorkInNorwayPageConfig = {
    readonly id: WorkInNorwayPageId;
    readonly category: "work-in-norway";
    /**
     * Nøkkel i translations-fila (valgfritt, men kan brukes i nettstedkartet)
     */
    readonly titleKey?: string;
};

export const WORK_IN_NORWAY_LOCALES: readonly WorkInNorwayLocale[] = ["en", "ru", "uk"] as const;

export const WORK_IN_NORWAY_PAGES: readonly WorkInNorwayPageConfig[] = [
    {
        id: "work-in-norway",
        category: "work-in-norway",
        titleKey: "frontpage-title",
    },
    {
        id: "work-in-norway/applying-for-job",
        category: "work-in-norway",
        titleKey: "applying-for-job-title",
    },
    {
        id: "work-in-norway/finding-a-job",
        category: "work-in-norway",
        titleKey: "finding-a-job-title",
    },
    {
        id: "work-in-norway/starting-a-new-job",
        category: "work-in-norway",
        titleKey: "starting-a-new-job-title",
    },
    {
        id: "work-in-norway/unemployed",
        category: "work-in-norway",
        titleKey: "unemployed-title",
    },
];
