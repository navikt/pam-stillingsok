import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import SlikSkriverDuEnGodCv from "@/app/(artikler)/slik-skriver-du-en-god-cv/SlikSkriverDuEnGodCv";

const pageInfo: PageInfo = {
    title: "Slik skriv du ein god CV ",
    language: "nn",
    proofread: false,
    category: "jobseeker-guides",
    description:
        "Lær å skriva ein god CV som viser kompetansen din tydeleg og gjer det lettare å bli kalla inn til intervju.",
    updatedAt: "2025-11-28",
    ogImagePath: "/images/writing.jpg",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <SlikSkriverDuEnGodCv meta={pageInfo} />;
}
