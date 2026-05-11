import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import VilkarStillingsannonser from "@/app/(artikler)/vilkar-stillingsannonser/VilkarStillingsannonser";

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
