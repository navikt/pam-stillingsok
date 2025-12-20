import type { ArticleCategory, ArticleLanguage } from "../pageInfoTypes";

export type SiteMapEntry = {
    readonly href: string;
    readonly title: string;
    readonly description?: string;
    readonly category: ArticleCategory;
    readonly language: ArticleLanguage;
};

export type SiteMapCategoryGroup = {
    readonly id: ArticleCategory;
    readonly heading: string;
    readonly description?: string;
    readonly entries: readonly SiteMapEntry[];
};
