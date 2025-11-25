import PersonvernSuperraskSoknad from "@/app/(artikler)/personvern-superrask-soknad/PersonvernSuperraskSoknad";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const pageInfo: PageInfo = {
    title: "Personvernerklæring for superrask søknad",
    language: "nb",
    proofread: true,
    category: "privacy-and-terms",
    description: "Personvernerklæring for deg som bruker Superrask søknad til å søke på stillinger.",
    updatedAt: "2025-04-11",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <PersonvernSuperraskSoknad meta={pageInfo} />;
}
