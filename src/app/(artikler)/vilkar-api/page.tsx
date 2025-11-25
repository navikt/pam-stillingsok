import VilkarApi from "@/app/(artikler)/vilkar-api/VilkarApi";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Vilkår for bruk av API for stillingsannonser",
    language: "nb",
    proofread: true,
    category: "api-and-integrations",
    description: "Les vilkårene for bruk av APIene til arbeidsplassen.no.",
    updatedAt: "2025-05-16",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <VilkarApi meta={articleMeta} />;
}
