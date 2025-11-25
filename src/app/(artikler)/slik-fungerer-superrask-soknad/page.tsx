import SlikFungererSuperraskSoknad from "@/app/(artikler)/slik-fungerer-superrask-soknad/SlikFungererSuperraskSoknad";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const pageInfo: PageInfo = {
    title: "Slik fungerer Superrask søknad",
    language: "nb",
    proofread: true,
    category: "superrask-soknad",
    description: "Forklaring av hvordan Superrask søknad fungerer for jobbsøkere og arbeidsgivere.",
    updatedAt: "2025-09-11",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <SlikFungererSuperraskSoknad meta={pageInfo} />;
}
