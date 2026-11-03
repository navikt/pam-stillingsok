import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import SlikFungererSuperraskSoknad from "@/app/(artikler)/slik-fungerer-superrask-soknad/SlikFungererSuperraskSoknad";

const pageInfo: PageInfo = {
    title: "Slik fungerer superrask søknad",
    language: "nb",
    proofread: true,
    category: "superrask-soknad",
    description: "Forklaring av hvordan superrask søknad fungerer for jobbsøkere og arbeidsgivere.",
    updatedAt: "2026-09-01",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <SlikFungererSuperraskSoknad meta={pageInfo} />;
}
