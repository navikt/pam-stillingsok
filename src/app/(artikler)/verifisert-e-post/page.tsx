import VerifisertEpost from "@/app/(artikler)/verifisert-e-post/VerifisertEpost";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "E-postadressen din er bekreftet",
    language: "nb",
    proofread: true,
    category: "auth-flow",
    description: "E-postadressen din er verifisert. Nå kan du ta i bruk tjenestene på arbeidsplassen.no.",
    updatedAt: "2025-05-16",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <VerifisertEpost meta={articleMeta} />;
}
