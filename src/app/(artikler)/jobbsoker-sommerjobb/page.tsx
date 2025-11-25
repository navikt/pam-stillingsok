import SommerjobbJobbsoker from "@/app/(artikler)/jobbsoker-sommerjobb/SommerjobbJobbsoker";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Sommerjobben venter på deg!",
    language: "nb",
    proofread: true,
    category: "jobseeker-guides",
    description: "Tips til deg som søker sommerjobb, fra forberedelser og søknad til intervju og oppfølging.",
    updatedAt: "2024-11-23",
    ogImagePath: "/images/woman-portrait-gardening.jpg",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <SommerjobbJobbsoker meta={articleMeta} />;
}
