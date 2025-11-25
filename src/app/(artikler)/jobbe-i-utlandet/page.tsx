import JobbeIUtlandet from "@/app/(artikler)/jobbe-i-utlandet/JobbeIUtlandet";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Jobbe i utlandet",
    language: "nb",
    proofread: true,
    category: "jobseeker-guides",
    description:
        "Informasjon til deg som vil jobbe i utlandet, om rettigheter, plikter og hvordan du finner stillinger.",
    updatedAt: "2024-11-23",
    ogImagePath: "/images/paris.jpg",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <JobbeIUtlandet meta={articleMeta} />;
}
