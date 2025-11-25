import IntroduksjonTilNySideForAnnonser from "@/app/(artikler)/introduksjon-til-ny-side-for-annonser/IntroduksjonTilNySideForAnnonser";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const pageInfo: PageInfo = {
    title: "Introduksjon til ny side for annonser",
    language: "nb",
    proofread: true,
    category: "employer-guides",
    description:
        "Introduksjon til den nye siden for stillingsannonser og hvordan endringene gjør det enklere å finne og lese annonser.",
    updatedAt: "2025-04-23",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <IntroduksjonTilNySideForAnnonser meta={pageInfo} />;
}
