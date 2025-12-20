import SommerjobbJobbsoker from "@/app/(static)/(artikler)/jobbsoker-sommerjobb/SommerjobbJobbsoker";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(static)/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Sommarjobben ventar på deg!",
    language: "nn",
    proofread: false,
    category: "jobseeker-guides",
    description: "Tips til deg som søkjer sommarjobb, frå førebuingar og søknad til intervju og oppfølging.",
    updatedAt: "2025-12-02",
    ogImagePath: "/images/woman-portrait-gardening.jpg",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <SommerjobbJobbsoker meta={pageInfo} />;
}
