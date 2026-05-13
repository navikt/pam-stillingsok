import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import EpostVerifiseringUtgaatt from "@/app/(artikler)/epost-verifisering-utgaatt/EpostVerifiseringUtgaatt";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";

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
