import HvordanFaTilgang from "@/app/(artikler)/hvordan-fa-tilgang/HvordanFaTilgang";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const pageInfo: PageInfo = {
    title: "Slik kan du skaffe deg tilgang",
    language: "nb",
    proofread: true,
    category: "employer-guides",
    description:
        "Finn ut hvordan du får tilgang som arbeidsgiver for å opprette og administrere stillingsannonser på arbeidsplassen.no.",
    updatedAt: "2025-09-15",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <HvordanFaTilgang meta={pageInfo} />;
}
