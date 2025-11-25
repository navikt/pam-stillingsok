import NyttigeArtiklerForJobbsokere from "@/app/(artikler)/nyttige-artikler-for-jobbsokere/NyttigeArtiklerForJobbsokere";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Nyttige artikler for jobbsøkere",
    language: "nb",
    proofread: true,
    category: "jobseeker-guides",
    description: "Samleside med nyttige artikler for jobbsøkere om CV, søknad, intervju og det å finne jobb.",
    updatedAt: "2024-11-23",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <NyttigeArtiklerForJobbsokere meta={articleMeta} />;
}
