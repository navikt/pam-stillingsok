import { articleConfig } from "./articleConfig.generated";
import type { ArticleCategory, ArticleConfig, ArticleMeta } from "./articleMetaTypes";
import { SITE_MAP_CATEGORIES } from "./siteMapCategories";

export type SiteMapEntry = {
    readonly href: string;
    readonly title: string;
    readonly description?: string;
    readonly category: ArticleCategory;
    readonly language: ArticleMeta["language"];
};

export type SiteMapCategoryGroup = {
    readonly id: ArticleCategory;
    readonly heading: string;
    readonly description?: string;
    readonly entries: readonly SiteMapEntry[];
};

type BuildSiteMapOptions = {
    readonly basePath?: string;
    readonly includeLanguages?: readonly ArticleMeta["language"][];
    readonly configOverride?: ArticleConfig;
};

export function buildSiteMapGroups(options?: BuildSiteMapOptions): readonly SiteMapCategoryGroup[] {
    const basePath = options?.basePath ?? "";
    const includeLanguages = options?.includeLanguages;
    const config: ArticleConfig = options?.configOverride ?? articleConfig;

    const allEntries: SiteMapEntry[] = Object.entries(config)
        .flatMap(([slug, meta]) => {
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
        })
        .sort((a, b) => a.title.localeCompare(b.title, "nb"));

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
