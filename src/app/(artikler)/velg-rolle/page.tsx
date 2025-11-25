import VelgRolle from "@/app/(artikler)/velg-rolle/VelgRolle";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Er du jobbsøker eller arbeidsgiver?",
    language: "nb",
    proofread: true,
    category: "auth-flow",
    description: "Velg om du vil fortsette som jobbsøker eller arbeidsgiver for å få riktig innhold og tjenester.",
    updatedAt: "2025-05-16",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <VelgRolle meta={articleMeta} />;
}
