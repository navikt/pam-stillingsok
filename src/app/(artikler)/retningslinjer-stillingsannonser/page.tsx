import RetningslinjerStillingsannonser from "@/app/(artikler)/retningslinjer-stillingsannonser/RetningslinjerStillingsannonser";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Retningslinjer for innhald i annonsar i Nav si stillingsbase",
    language: "nn",
    proofread: true,
    category: "employer-guides",
    description: "Retningslinjer for innhald i stillingsannonsar publiserte på arbeidsplassen.no.",
    updatedAt: "2025-12-02",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <RetningslinjerStillingsannonser meta={pageInfo} />;
}
