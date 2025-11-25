import LysUtSommerjobber from "@/app/(artikler)/lys-ut-sommerjobber/LysUtSommerjobber";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const pageInfo: PageInfo = {
    title: "Gi ungdom en sjanse – lys ut sommerjobber",
    language: "nb",
    proofread: true,
    category: "employer-guides",
    description: "Veiledning til arbeidsgivere om hvordan lyse ut sommerjobber og nå relevante jobbsøkere.",
    updatedAt: "2025-05-02",
    ogImagePath: "/images/laerling-billakk.jpg",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <LysUtSommerjobber meta={pageInfo} />;
}
