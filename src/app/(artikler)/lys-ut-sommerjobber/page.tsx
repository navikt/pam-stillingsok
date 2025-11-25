import LysUtSommerjobber from "@/app/(artikler)/lys-ut-sommerjobber/LysUtSommerjobber";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Gi ungdom en sjanse – lys ut sommerjobber",
    language: "nb",
    proofread: true,
    category: "employer-guides",
    description: "Veiledning til arbeidsgivere om hvordan lyse ut sommerjobber og nå relevante jobbsøkere.",
    updatedAt: "2024-11-23",
    ogImagePath: "/images/laerling-billakk.jpg",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <LysUtSommerjobber meta={articleMeta} />;
}
