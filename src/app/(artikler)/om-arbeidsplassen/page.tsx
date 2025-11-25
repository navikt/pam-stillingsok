import OmArbeidsplassen from "@/app/(artikler)/om-arbeidsplassen/OmArbeidsplassen";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Om arbeidsplassen.no",
    language: "nb",
    proofread: true,
    category: "about-service",
    description: "Les om arbeidsplassen.no, hvem tjenesten er for og hvordan vi kobler jobbsøkere og arbeidsgivere.",
    updatedAt: "2024-11-23",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <OmArbeidsplassen meta={articleMeta} />;
}
