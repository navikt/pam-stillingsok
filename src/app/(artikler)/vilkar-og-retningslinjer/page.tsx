import VilkarOgRetningslinjer from "@/app/(artikler)/vilkar-og-retningslinjer/VilkarOgRetningslinjer";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const pageInfo: PageInfo = {
    title: "Vilkår og retningslinjer",
    metaTitle: "Vilkår for å bruke arbeidsgivertjenestene",
    language: "nb",
    proofread: true,
    category: "privacy-and-terms",
    description: "Oversikt over vilkår og retningslinjer for bruk av arbeidsplassen.no og tilhørende tjenester.",
    updatedAt: "2025-04-11",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <VilkarOgRetningslinjer meta={pageInfo} />;
}
