import NyttSok from "@/app/(artikler)/slik-bruker-du-det-nye-soket/NyttSok";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Slik bruker du det nye søket",
    language: "nb",
    proofread: true,
    category: "search-and-features",
    description: "Slik bruker du det nye søket på arbeidsplassen.no for å finne relevante stillinger og innhold.",
    updatedAt: "2023-01-16",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <NyttSok meta={articleMeta} />;
}
