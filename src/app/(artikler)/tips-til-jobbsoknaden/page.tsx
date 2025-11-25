import TipsTilJobbsoknaden from "@/app/(artikler)/tips-til-jobbsoknaden/TipsTilJobbsoknaden";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Tips til jobbsøknaden",
    language: "nb",
    proofread: true,
    category: "jobseeker-guides",
    description:
        "Få tips til hvordan du skriver en målrettet jobbsøknad som viser motivasjon og hvorfor du passer til jobben.",
    updatedAt: "2025-05-16",
    ogImagePath: "/images/students.jpg",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <TipsTilJobbsoknaden meta={articleMeta} />;
}
