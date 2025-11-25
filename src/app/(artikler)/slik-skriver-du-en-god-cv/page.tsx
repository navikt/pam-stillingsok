import SlikSkriverDuEnGodCv from "@/app/(artikler)/slik-skriver-du-en-god-cv/SlikSkriverDuEnGodCv";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Slik skriver du en god CV",
    language: "nb",
    proofread: true,
    category: "jobseeker-guides",
    description:
        "Lær å skrive en god CV som viser kompetansen din tydelig og gjør det lettere å bli kalt inn til intervju.",
    updatedAt: "2023-01-16",
    ogImagePath: "/images/writing.jpg",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <SlikSkriverDuEnGodCv meta={articleMeta} />;
}
