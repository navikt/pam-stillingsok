import NyttSokefelt from "@/app/(artikler)/nytt-sokefelt/NyttSokefelt";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Nytt søkefelt! Enklere, raskere og mer fleksibelt!",
    language: "nb",
    proofread: true,
    category: "search-and-features",
    description: "Bli kjent med det nye søkefeltet og hvordan det gjør det enklere å finne stillinger og innhold.",
    updatedAt: "2024-11-23",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <NyttSokefelt meta={articleMeta} />;
}
