import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import VilkarSuperraskSoknad from "@/app/(artikler)/vilkar-superrask-soknad/VilkarSuperraskSoknad";

const pageInfo: PageInfo = {
    title: "Vilkår for bruk av superrask søknad",
    language: "nn",
    proofread: false,
    category: "superrask-soknad",
    description: "Vilkår for bruk av Superrask søknad for arbeidsgivarar og jobbsøkjarar.",
    updatedAt: "2025-12-04",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <VilkarSuperraskSoknad meta={pageInfo} />;
}
