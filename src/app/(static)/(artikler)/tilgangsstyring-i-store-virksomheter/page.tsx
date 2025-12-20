import TilgangsstyringIStoreVirksomheter from "@/app/(static)/(artikler)/tilgangsstyring-i-store-virksomheter/TilgangsstyringIStoreVirksomheter";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(static)/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Tilgangsstyring i store verksemder",
    language: "nn",
    proofread: false,
    category: "employer-guides",
    description: "Rettleiing i tilgangsstyring for store verksemder med mange brukarar og roller.",
    updatedAt: "2025-12-04",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <TilgangsstyringIStoreVirksomheter meta={pageInfo} />;
}
