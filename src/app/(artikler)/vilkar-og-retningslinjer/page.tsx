import VilkarOgRetningslinjer from "@/app/(artikler)/vilkar-og-retningslinjer/VilkarOgRetningslinjer";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Vilkår og retningslinjer",
    metaTitle: "Vilkår for å bruke arbeidsgivartenestene",
    language: "nn",
    proofread: false,
    category: "privacy-and-terms",
    description: "Oversikt over vilkår og retningslinjer for bruk av arbeidsplassen.no og tilhøyrande tenester.",
    updatedAt: "2025-04-12",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <VilkarOgRetningslinjer meta={pageInfo} />;
}
