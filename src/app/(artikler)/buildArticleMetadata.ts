import type { Metadata } from "next";
import type { PageInfo } from "./pageInfoTypes";
import { buildSeoMetadata } from "@/app/_common/seo/buildSeoMetadata";

const SITE_URL: string = process.env.NEXT_PUBLIC_BASE_URL ?? "https://arbeidsplassen.nav.no";

// Felles fallback-bilde for artikler
const DEFAULT_OG_IMAGE_PATH = "/images/arbeidsplassen-open-graph.png";

type BuildArticleMetadataParams = {
    readonly meta: PageInfo;
    readonly robots?: Metadata["robots"];
};

export function buildArticleMetadata(params: BuildArticleMetadataParams): Metadata {
    const { meta, robots } = params;

    const imagePath =
        meta.ogImagePath != null && meta.ogImagePath.length > 0 ? meta.ogImagePath : DEFAULT_OG_IMAGE_PATH;

    const imageUrl = imagePath.startsWith("http") ? imagePath : `${SITE_URL}${imagePath}`;

    const titleForMeta = meta.metaTitle ?? meta.title;

    const base = buildSeoMetadata({
        title: titleForMeta,
        description: meta.description,
        imageUrl,
    });

    if (robots != null) {
        return {
            ...base,
            robots,
        };
    }

    return base;
}
