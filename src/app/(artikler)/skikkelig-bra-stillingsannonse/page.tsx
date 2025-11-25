import SkikkeligBraStillingsannonse from "@/app/(artikler)/skikkelig-bra-stillingsannonse/SkikkeligBraStillingsannonse";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Hvordan skriver du en skikkelig bra stillingsannonse?",
    language: "nb",
    proofread: true,
    category: "employer-guides",
    description: "Lær hvordan du skriver en skikkelig bra stillingsannonse som treffer riktige kandidater.",
    updatedAt: "2023-01-16",
    ogImagePath: "/images/stillingsannonse.jpg",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <SkikkeligBraStillingsannonse meta={articleMeta} />;
}
