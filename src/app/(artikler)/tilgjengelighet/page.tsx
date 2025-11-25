import Tilgjengelighet from "@/app/(artikler)/tilgjengelighet/Tilgjengelighet";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Tilgjengelighet",
    language: "nb",
    proofread: true,
    category: "about-service",
    description:
        "Her finner du informasjon om tilgjengeligheten på arbeidsplassen.no og hvordan vi jobber med universell utforming.",
    updatedAt: "2025-05-16",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <Tilgjengelighet meta={articleMeta} />;
}
