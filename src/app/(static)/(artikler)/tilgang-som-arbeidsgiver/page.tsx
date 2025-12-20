import TilgangSomArbeidsgiver from "@/app/(static)/(artikler)/tilgang-som-arbeidsgiver/TilgangSomArbeidsgiver";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(static)/(artikler)/buildPageMetadata";

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
