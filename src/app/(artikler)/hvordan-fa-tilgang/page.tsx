import HvordanFaTilgang from "@/app/(artikler)/hvordan-fa-tilgang/HvordanFaTilgang";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Slik kan du skaffe deg tilgang",
    language: "nb",
    proofread: true,
    category: "employer-guides",
    description:
        "Finn ut hvordan du får tilgang som arbeidsgiver for å opprette og administrere stillingsannonser på arbeidsplassen.no.",
    updatedAt: "2024-11-23",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <HvordanFaTilgang meta={articleMeta} />;
}
