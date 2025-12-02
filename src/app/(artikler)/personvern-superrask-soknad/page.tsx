import PersonvernSuperraskSoknad from "@/app/(artikler)/personvern-superrask-soknad/PersonvernSuperraskSoknad";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Personvernerklæring for superrask søknad",
    language: "nn",
    proofread: false,
    category: "privacy-and-terms",
    description: "Personvernerklæring for deg som bruker Superrask søknad til å søkja på stillingar.",
    updatedAt: "2025-12-03",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <PersonvernSuperraskSoknad meta={pageInfo} />;
}
