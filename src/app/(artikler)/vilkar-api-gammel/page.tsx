import VilkarApiGammel from "@/app/(artikler)/vilkar-api-gammel/VilkarApiGammel";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Gamle vilkår for bruk av API for stillingsannonser - Job Ads Public Feed",
    metaTitle: "Gamle vilkår for bruk av API for stillingsannonser",
    language: "nb",
    proofread: true,
    category: "api-and-integrations",
    description: "Tidligere vilkår for bruk av APIene til arbeidsplassen.no, for deg som trenger historikk.",
    updatedAt: "2025-05-16",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <VilkarApiGammel meta={articleMeta} />;
}
