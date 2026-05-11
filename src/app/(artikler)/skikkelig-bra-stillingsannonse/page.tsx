import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import SkikkeligBraStillingsannonse from "@/app/(artikler)/skikkelig-bra-stillingsannonse/SkikkeligBraStillingsannonse";

const pageInfo: PageInfo = {
    title: "Korleis skriv du ei skikkeleg god stillingsannonse?",
    language: "nn",
    proofread: true,
    category: "employer-guides",
    description:
        "Kva ser jobbsøkjarar etter når dei les ei stillingsannonse? Kva bør du tenkje på når du skriv annonsen, slik at du kjem i kontakt med akkurat dei søkjarane du ønskjer?",
    updatedAt: "2025-11-28",
    ogImagePath: "/images/stillingsannonse.jpg",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <SkikkeligBraStillingsannonse meta={pageInfo} />;
}
