import Vilkar from "@/app/(artikler)/vilkar/Vilkar";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Vilkår for å publisere stillinger",
    language: "nb",
    proofread: true,
    category: "privacy-and-terms",
    description: "Les vilkårene for bruk av arbeidsplassen.no og hvilke rettigheter og plikter du har.",
    updatedAt: "2025-05-16",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <Vilkar meta={articleMeta} />;
}
