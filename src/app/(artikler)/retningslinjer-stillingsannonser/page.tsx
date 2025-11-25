import RetningslinjerStillingsannonser from "@/app/(artikler)/retningslinjer-stillingsannonser/RetningslinjerStillingsannonser";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Retningslinjer for innhold i annonser i Navs stillingsbase",
    language: "nb",
    proofread: true,
    category: "employer-guides",
    description: "Retningslinjer for innhold i stillingsannonser publisert på arbeidsplassen.no.",
    updatedAt: "2023-01-16",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <RetningslinjerStillingsannonser meta={articleMeta} />;
}
