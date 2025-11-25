import IntroduksjonTilNySideForAnnonser from "@/app/(artikler)/introduksjon-til-ny-side-for-annonser/IntroduksjonTilNySideForAnnonser";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Introduksjon til ny side for annonser",
    language: "nb",
    proofread: true,
    category: "employer-guides",
    description:
        "Introduksjon til den nye siden for stillingsannonser og hvordan endringene gjør det enklere å finne og lese annonser.",
    updatedAt: "2024-11-23",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <IntroduksjonTilNySideForAnnonser meta={articleMeta} />;
}
