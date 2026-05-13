import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import RekrutereFlyktninger from "@/app/(artikler)/rekruttere-flyktninger/RekrutereFlyktninger";

const pageInfo: PageInfo = {
    title: "Ønsker du å rekruttere flyktninger?",
    language: "nb",
    proofread: true,
    category: "employer-guides",
    description: "Veiledning til arbeidsgivere som vil rekruttere flyktninger, med råd om prosess og tilrettelegging.",
    updatedAt: "2025-04-11",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <RekrutereFlyktninger meta={pageInfo} />;
}
