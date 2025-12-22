import NyeFiltre from "@/app/(static)/(artikler)/nye-filtre/NyeFiltre";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(static)/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Nye filtre gjør det enda enklere å finne jobber som passer",
    language: "nb",
    proofread: true,
    category: "search-and-features",
    description:
        "Oversikt over de nye filtrene i stillingssøket og hvordan de hjelper deg å finne riktige jobber raskere.",
    updatedAt: "2025-05-02",
    ogImagePath: "/images/jobbtreff.jpg",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <NyeFiltre meta={pageInfo} />;
}
