import SommerjobbJobbsoker from "@/app/(artikler)/jobbsoker-sommerjobb/SommerjobbJobbsoker";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const pageInfo: PageInfo = {
    title: "Sommerjobben venter på deg!",
    language: "nb",
    proofread: true,
    category: "jobseeker-guides",
    description: "Tips til deg som søker sommerjobb, fra forberedelser og søknad til intervju og oppfølging.",
    updatedAt: "2025-05-02",
    ogImagePath: "/images/woman-portrait-gardening.jpg",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <SommerjobbJobbsoker meta={pageInfo} />;
}
