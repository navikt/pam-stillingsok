import { articleConfig } from "../pageInfoConfig.generated";
import type { ArticleCategory, PageInfoConfig, PageInfo } from "../pageInfoTypes";
import { NETTSTEDKART_KATEGORIER } from "./siteMapCategories";
import { buildWorkInNorwaySiteMapEntries } from "@/app/(artikler)/siteMap/workInNorwayConfig";
import { SiteMapCategoryGroup, SiteMapEntry } from "./siteMapTypes";

type BuildSiteMapOptions = {
    readonly basePath?: string;
    readonly includeLanguages?: readonly PageInfo["language"][];
    readonly configOverride?: PageInfoConfig;
};

export async function buildSiteMapGroups(options?: BuildSiteMapOptions): Promise<readonly SiteMapCategoryGroup[]> {
    const basePath = options?.basePath ?? "";
    const includeLanguages = options?.includeLanguages;
    const config: PageInfoConfig = options?.configOverride ?? articleConfig;

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

    const workInNorwayEntries = await buildWorkInNorwaySiteMapEntries({
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

    return NETTSTEDKART_KATEGORIER.map((configItem) => {
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
