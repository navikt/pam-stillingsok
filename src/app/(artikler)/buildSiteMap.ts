import { articleConfig } from "./articleConfig.generated";
import type { ArticleCategory, ArticleConfig, PageInfo } from "./pageInfoTypes";
import { SITE_MAP_CATEGORIES } from "./siteMapCategories";
import { buildWorkInNorwaySiteMapEntries } from "@/app/(artikler)/workInNorwayConfig";

export type SiteMapEntry = {
    readonly href: string;
    readonly title: string;
    readonly description?: string;
    readonly category: ArticleCategory;
    readonly language: PageInfo["language"];
};

export type SiteMapCategoryGroup = {
    readonly id: ArticleCategory;
    readonly heading: string;
    readonly description?: string;
    readonly entries: readonly SiteMapEntry[];
};

type BuildSiteMapOptions = {
    readonly basePath?: string;
    readonly includeLanguages?: readonly PageInfo["language"][];
    readonly configOverride?: ArticleConfig;
};

export function buildSiteMapGroups(options?: BuildSiteMapOptions): readonly SiteMapCategoryGroup[] {
    const basePath = options?.basePath ?? "";
    const includeLanguages = options?.includeLanguages;
    const config: ArticleConfig = options?.configOverride ?? articleConfig;

    const staticEntries: SiteMapEntry[] = Object.entries(config).flatMap(([slug, meta]) => {
        if (meta.excludeFromSiteMap === true) {
            return [];
        }

        if (includeLanguages != null && !includeLanguages.includes(meta.language)) {
            return [];
        }

        const href = `${basePath}/${slug}`.replace(/\/+/g, "/");

        return [
            {
                href,
                title: meta.title,
                description: meta.description,
                category: meta.category,
                language: meta.language,
            },
        ];
    });

    const workInNorwayEntries = buildWorkInNorwaySiteMapEntries({
        basePath,
        includeLanguages,
    });

    const allEntries: SiteMapEntry[] = [...staticEntries, ...workInNorwayEntries].sort((a, b) =>
        a.title.localeCompare(b.title, "nb"),
    );

    const grouped = new Map<ArticleCategory, SiteMapEntry[]>();

    for (const entry of allEntries) {
        const current = grouped.get(entry.category) ?? [];
        current.push(entry);
        grouped.set(entry.category, current);
    }

    return SITE_MAP_CATEGORIES.map((configItem) => {
        const entries = grouped.get(configItem.id) ?? [];
        const sortedEntries = [...entries].sort((a, b) => a.title.localeCompare(b.title, "nb"));

        return {
            id: configItem.id,
            heading: configItem.heading,
            description: configItem.description,
            entries: sortedEntries,
        };
    }).filter((group) => group.entries.length > 0);
}
