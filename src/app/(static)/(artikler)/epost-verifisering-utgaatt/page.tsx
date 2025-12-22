import EpostVerifiseringUtgaatt from "@/app/(static)/(artikler)/epost-verifisering-utgaatt/EpostVerifiseringUtgaatt";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(static)/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Lenken er dessverre utgått",
    language: "nb",
    proofread: true,
    category: "auth-flow",
    description: "Lenken for e-postverifisering er utgått. Her får du hjelp til å bekrefte e-posten din på nytt.",
    updatedAt: "2025-04-11",
    excludeFromSiteMap: true,
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <EpostVerifiseringUtgaatt meta={pageInfo} />;
}
