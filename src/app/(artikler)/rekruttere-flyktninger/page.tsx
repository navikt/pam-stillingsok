import RekrutereFlyktninger from "@/app/(artikler)/rekruttere-flyktninger/RekrutereFlyktninger";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const pageInfo: PageInfo = {
    title: "Ønsker du å rekruttere flyktninger?",
    language: "nb",
    proofread: true,
    category: "employer-guides",
    description: "Veiledning til arbeidsgivere som vil rekruttere flyktninger, med råd om prosess og tilrettelegging.",
    updatedAt: "2025-04-11",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <RekrutereFlyktninger meta={pageInfo} />;
}
