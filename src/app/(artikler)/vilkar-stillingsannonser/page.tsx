import VilkarStillingsannonser from "@/app/(artikler)/vilkar-stillingsannonser/VilkarStillingsannonser";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Vilkår for å publisere stillingsannonser på arbeidsplassen.no",
    language: "nb",
    proofread: true,
    category: "privacy-and-terms",
    description: "Vilkår for publisering av stillingsannonser på arbeidsplassen.no.",
    updatedAt: "2025-04-11",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <VilkarStillingsannonser meta={pageInfo} />;
}
