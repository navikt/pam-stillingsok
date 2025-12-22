import VilkarStillingsannonser from "@/app/(static)/(artikler)/vilkar-stillingsannonser/VilkarStillingsannonser";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(static)/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Vilkår for å publisera stillingsannonsar på arbeidsplassen.no",
    language: "nn",
    proofread: false,
    category: "privacy-and-terms",
    description: "Vilkår for publisering av stillingsannonsar på arbeidsplassen.no.",
    updatedAt: "2025-12-04",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <VilkarStillingsannonser meta={pageInfo} />;
}
