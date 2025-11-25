import NyttigeArtiklerForBedrifter from "@/app/(artikler)/nyttige-artikler-for-bedrifter/NyttigeArtiklerForBedrifter";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Nyttige artikler for bedrifter",
    language: "nb",
    proofread: true,
    category: "employer-guides",
    description:
        "Samleside med nyttige artikler for bedrifter om rekruttering, annonsering og bruk av arbeidsplassen.no.",
    updatedAt: "2024-11-23",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <NyttigeArtiklerForBedrifter meta={articleMeta} />;
}
