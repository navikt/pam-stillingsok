import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import TilgangsstyringIStoreVirksomheter from "@/app/(artikler)/tilgangsstyring-i-store-virksomheter/TilgangsstyringIStoreVirksomheter";

const pageInfo: PageInfo = {
    title: "Tilgangsstyring i store virksomheter",
    language: "nb",
    proofread: false,
    category: "employer-guides",
    description: "Veiledning i tilgangsstyring for store virksomheter med mange brukere og roller.",
    updatedAt: "2026-11-12",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <TilgangsstyringIStoreVirksomheter meta={pageInfo} />;
}
