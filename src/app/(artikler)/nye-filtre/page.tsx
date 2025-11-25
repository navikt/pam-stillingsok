import NyeFiltre from "@/app/(artikler)/nye-filtre/NyeFiltre";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Nye filtre gjør det enda enklere å finne jobber som passer",
    language: "nb",
    proofread: true,
    category: "search-and-features",
    description:
        "Oversikt over de nye filtrene i stillingssøket og hvordan de hjelper deg å finne riktige jobber raskere.",
    updatedAt: "2024-11-23",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <NyeFiltre meta={articleMeta} />;
}
