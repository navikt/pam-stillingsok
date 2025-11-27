import type { MetadataRoute } from "next";
import articleConfig from "./(artikler)/articleConfig.generated";
import { WORK_IN_NORWAY_LOCALES, WORK_IN_NORWAY_PAGES } from "./(artikler)/siteMap/workInNorwayConfig";

const BASE_URL = "https://arbeidsplassen.nav.no";

export default function sitemap(): MetadataRoute.Sitemap {
    const staticArticles = Object.keys(articleConfig).map<MetadataRoute.Sitemap[number]>((slug) => {
        return {
            url: `${BASE_URL}/${slug}`,
            lastModified: articleConfig[slug].updatedAt ?? undefined,
            changeFrequency: "monthly",
            priority: 0.5,
        };
    });

    const workInNorwayEntries: MetadataRoute.Sitemap = WORK_IN_NORWAY_PAGES.flatMap((page) => {
        return WORK_IN_NORWAY_LOCALES.map<MetadataRoute.Sitemap[number]>((locale) => {
            return {
                url: `${BASE_URL}/${locale}/${page.id}`,
                // Hvis du vil ha egen updatedAt kan du legge det på configen senere
                lastModified: undefined,
                changeFrequency: "monthly",
                priority: 0.6,
            };
        });
    });

    return [...staticArticles, ...workInNorwayEntries];
}
