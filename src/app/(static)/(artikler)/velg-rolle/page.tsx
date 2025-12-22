import VelgRolle from "@/app/(static)/(artikler)/velg-rolle/VelgRolle";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(static)/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Er du jobbsøker eller arbeidsgiver?",
    language: "nb",
    proofread: true,
    category: "auth-flow",
    description: "Velg om du vil fortsette som jobbsøker eller arbeidsgiver for å få riktig innhold og tjenester.",
    updatedAt: "2025-04-23",
    excludeFromSiteMap: true,
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <VelgRolle meta={pageInfo} />;
}
