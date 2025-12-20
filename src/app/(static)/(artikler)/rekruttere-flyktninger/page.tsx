import RekrutereFlyktninger from "@/app/(static)/(artikler)/rekruttere-flyktninger/RekrutereFlyktninger";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(static)/(artikler)/buildPageMetadata";

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
