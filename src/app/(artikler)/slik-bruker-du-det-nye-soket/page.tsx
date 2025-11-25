import NyttSok from "@/app/(artikler)/slik-bruker-du-det-nye-soket/NyttSok";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const pageInfo: PageInfo = {
    title: "Slik bruker du det nye søket",
    language: "nb",
    proofread: true,
    category: "search-and-features",
    description: "Slik bruker du det nye søket på arbeidsplassen.no for å finne relevante stillinger og innhold.",
    updatedAt: "2025-04-23",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <NyttSok meta={pageInfo} />;
}
