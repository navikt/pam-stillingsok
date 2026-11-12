import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import HvordanFaTilgang from "@/app/(artikler)/hvordan-fa-tilgang/HvordanFaTilgang";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";

const pageInfo: PageInfo = {
    title: "Slik kan du skaffe deg tilgang",
    language: "nb",
    proofread: false,
    category: "employer-guides",
    description:
        "Finn ut hvordan du får tilgang som arbeidsgiver for å opprette og administrere stillingsannonser på arbeidsplassen.no.",
    updatedAt: "2026-11-12",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <HvordanFaTilgang meta={pageInfo} />;
}
