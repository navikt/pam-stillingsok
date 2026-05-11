import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import TilgangSomArbeidsgiver from "@/app/(artikler)/tilgang-som-arbeidsgiver/TilgangSomArbeidsgiver";

const pageInfo: PageInfo = {
    title: "Hvordan gi eller få tilgang som arbeidsgiver",
    language: "nb",
    proofread: true,
    category: "employer-guides",
    description: "Finn ut hvordan du får og administrerer tilgang som arbeidsgiver for å bruke tjenestene våre.",
    updatedAt: "2025-09-15",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <TilgangSomArbeidsgiver meta={pageInfo} />;
}
