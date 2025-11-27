import TipsTilJobbsoknaden from "@/app/(artikler)/tips-til-jobbsoknaden/TipsTilJobbsoknaden";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Tips til jobbsøknaden",
    language: "nb",
    proofread: true,
    category: "jobseeker-guides",
    description:
        "Få tips til hvordan du skriver en målrettet jobbsøknad som viser motivasjon og hvorfor du passer til jobben.",
    updatedAt: "2025-05-02",
    ogImagePath: "/images/students.jpg",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <TipsTilJobbsoknaden meta={pageInfo} />;
}
