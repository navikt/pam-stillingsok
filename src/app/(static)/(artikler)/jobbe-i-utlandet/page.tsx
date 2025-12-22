import JobbeIUtlandet from "@/app/(static)/(artikler)/jobbe-i-utlandet/JobbeIUtlandet";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(static)/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Jobbe i utlandet",
    language: "nb",
    proofread: true,
    category: "jobseeker-guides",
    description:
        "Informasjon til deg som vil jobbe i utlandet, om rettigheter, plikter og hvordan du finner stillinger.",
    updatedAt: "2025-09-29",
    ogImagePath: "/images/paris.jpg",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <JobbeIUtlandet meta={pageInfo} />;
}
