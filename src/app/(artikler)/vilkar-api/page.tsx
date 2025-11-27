import VilkarApi from "@/app/(artikler)/vilkar-api/VilkarApi";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Vilkår for bruk av API for stillingsannonser",
    language: "nb",
    proofread: true,
    category: "api-and-integrations",
    description: "Les vilkårene for bruk av APIene til arbeidsplassen.no.",
    updatedAt: "2025-04-11",
    ogImagePath: "/images/api.png",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <VilkarApi meta={pageInfo} />;
}
