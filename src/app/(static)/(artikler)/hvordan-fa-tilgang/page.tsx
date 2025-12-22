import HvordanFaTilgang from "@/app/(static)/(artikler)/hvordan-fa-tilgang/HvordanFaTilgang";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(static)/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Slik kan du skaffa deg tilgang",
    language: "nn",
    proofread: false,
    category: "employer-guides",
    description:
        "Finn ut korleis du får tilgang som arbeidsgivar for å oppretta og administrera stillingsannonsar på arbeidsplassen.no.",
    updatedAt: "2025-12-02",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <HvordanFaTilgang meta={pageInfo} />;
}
