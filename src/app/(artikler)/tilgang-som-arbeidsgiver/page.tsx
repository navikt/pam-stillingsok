import TilgangSomArbeidsgiver from "@/app/(artikler)/tilgang-som-arbeidsgiver/TilgangSomArbeidsgiver";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Hvordan gi eller få tilgang som arbeidsgiver",
    language: "nb",
    proofread: true,
    category: "employer-guides",
    description: "Finn ut hvordan du får og administrerer tilgang som arbeidsgiver for å bruke tjenestene våre.",
    updatedAt: "2025-05-16",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <TilgangSomArbeidsgiver meta={articleMeta} />;
}
