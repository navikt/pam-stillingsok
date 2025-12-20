import NyttigeArtiklerForBedrifter from "@/app/(static)/(artikler)/nyttige-artikler-for-bedrifter/NyttigeArtiklerForBedrifter";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(static)/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Nyttige artikler for bedrifter",
    language: "nb",
    proofread: true,
    category: "employer-guides",
    description:
        "Samleside med nyttige artikler for bedrifter om rekruttering, annonsering og bruk av arbeidsplassen.no.",
    updatedAt: "2025-05-02",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <NyttigeArtiklerForBedrifter meta={pageInfo} />;
}
