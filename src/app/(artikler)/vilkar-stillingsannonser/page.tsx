import VilkarStillingsannonser from "@/app/(artikler)/vilkar-stillingsannonser/VilkarStillingsannonser";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Vilkår for å publisere stillingsannonser på arbeidsplassen.no",
    language: "nb",
    proofread: true,
    category: "privacy-and-terms",
    description: "Vilkår for publisering av stillingsannonser på arbeidsplassen.no.",
    updatedAt: "2025-05-16",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <VilkarStillingsannonser meta={articleMeta} />;
}
