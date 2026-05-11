import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import RetningslinjerStillingsannonser from "@/app/(artikler)/retningslinjer-stillingsannonser/RetningslinjerStillingsannonser";

const pageInfo: PageInfo = {
    title: "Retningslinjer for innhold i annonser i Navs stillingsbase",
    language: "nb",
    proofread: true,
    category: "employer-guides",
    description: "Retningslinjer for innhold i stillingsannonser publisert på arbeidsplassen.no.",
    updatedAt: "2026-03-31",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <RetningslinjerStillingsannonser meta={pageInfo} />;
}
