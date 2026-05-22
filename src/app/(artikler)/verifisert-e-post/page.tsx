import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import VerifisertEpost from "@/app/(artikler)/verifisert-e-post/VerifisertEpost";

const pageInfo: PageInfo = {
    title: "E-postadressen din er bekreftet",
    language: "nb",
    proofread: true,
    category: "auth-flow",
    description: "E-postadressen din er verifisert. Nå kan du ta i bruk tjenestene på arbeidsplassen.no.",
    updatedAt: "2025-04-11",
    excludeFromSiteMap: true,
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <VerifisertEpost meta={pageInfo} />;
}
