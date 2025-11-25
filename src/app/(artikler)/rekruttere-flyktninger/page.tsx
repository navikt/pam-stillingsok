import RekrutereFlyktninger from "@/app/(artikler)/rekruttere-flyktninger/RekrutereFlyktninger";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Ønsker du å rekruttere flyktninger?",
    language: "nb",
    proofread: true,
    category: "employer-guides",
    description: "Veiledning til arbeidsgivere som vil rekruttere flyktninger, med råd om prosess og tilrettelegging.",
    updatedAt: "2023-01-16",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <RekrutereFlyktninger meta={articleMeta} />;
}
