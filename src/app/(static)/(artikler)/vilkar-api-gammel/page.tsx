import VilkarApiGammel from "@/app/(static)/(artikler)/vilkar-api-gammel/VilkarApiGammel";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(static)/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Gamle vilkår for bruk av API for stillingsannonser - Job Ads Public Feed",
    metaTitle: "Gamle vilkår for bruk av API for stillingsannonser",
    language: "nb",
    proofread: true,
    category: "api-and-integrations",
    description: "Tidligere vilkår for bruk av APIene til arbeidsplassen.no, for deg som trenger historikk.",
    updatedAt: "2025-04-11",
    ogImagePath: "/images/api.png",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <VilkarApiGammel meta={pageInfo} />;
}
