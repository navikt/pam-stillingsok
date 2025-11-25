import SuperraskSoknadPerson from "@/app/(artikler)/superrask-soknad-person/SuperraskSoknadPerson";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Superrask søknad",
    language: "nb",
    proofread: true,
    category: "superrask-soknad",
    description: "Informasjon til jobbsøkere om hvordan Superrask søknad fungerer og hvordan du bruker den.",
    updatedAt: "2025-05-16",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <SuperraskSoknadPerson meta={articleMeta} />;
}
