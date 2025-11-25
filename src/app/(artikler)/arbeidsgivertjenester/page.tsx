import Arbeidsgivertjenester from "@/app/(artikler)/arbeidsgivertjenester/Arbeidsgivertjenester";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";
import { Metadata } from "next";

const articleMeta: ArticleMeta = {
    title: "Hvem kan bruke arbeidsgivertjenestene?",
    language: "nb",
    proofread: true,
    category: "employer-guides",
    description:
        "Få oversikt over arbeidsgivertjenestene på arbeidsplassen.no og hvordan du kan bruke dem i rekrutteringen.",
    updatedAt: "2024-11-23",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <Arbeidsgivertjenester meta={articleMeta} />;
}
