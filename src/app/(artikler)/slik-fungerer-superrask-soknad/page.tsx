import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import SlikFungererSuperraskSoknad from "@/app/(artikler)/slik-fungerer-superrask-soknad/SlikFungererSuperraskSoknad";

const pageInfo: PageInfo = {
    title: "Slik fungerer Superrask søknad",
    language: "nb",
    proofread: true,
    category: "superrask-soknad",
    description: "Forklaring av hvordan Superrask søknad fungerer for jobbsøkere og arbeidsgivere.",
    updatedAt: "2025-09-11",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <SlikFungererSuperraskSoknad meta={pageInfo} />;
}
