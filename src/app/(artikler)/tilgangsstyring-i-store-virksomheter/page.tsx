import TilgangsstyringIStoreVirksomheter from "@/app/(artikler)/tilgangsstyring-i-store-virksomheter/TilgangsstyringIStoreVirksomheter";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const pageInfo: PageInfo = {
    title: "Tilgangsstyring i store virksomheter",
    language: "nb",
    proofread: true,
    category: "employer-guides",
    description: "Veiledning i tilgangsstyring for store virksomheter med mange brukere og roller.",
    updatedAt: "2025-09-15",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <TilgangsstyringIStoreVirksomheter meta={pageInfo} />;
}
