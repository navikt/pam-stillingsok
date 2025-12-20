import LysUtSommerjobber from "@/app/(static)/(artikler)/lys-ut-sommerjobber/LysUtSommerjobber";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(static)/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Gi ungdom ein sjanse – lys ut sommarjobbar",
    language: "nn",
    proofread: false,
    category: "employer-guides",
    description: "Veiledning til arbeidsgivarar om korleis lyse ut sommarjobbar og no relevante jobbsøkjarar.",
    updatedAt: "2025-12-01",
    ogImagePath: "/images/laerling-billakk.jpg",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <LysUtSommerjobber meta={pageInfo} />;
}
