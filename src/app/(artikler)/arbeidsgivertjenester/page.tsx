import Arbeidsgivertjenester from "@/app/(artikler)/arbeidsgivertjenester/Arbeidsgivertjenester";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import { Metadata } from "next";

const pageInfo: PageInfo = {
    title: "Hvem kan bruke arbeidsgivertjenestene?",
    language: "nb",
    proofread: true,
    category: "employer-guides",
    description:
        "Få oversikt over arbeidsgivertjenestene på arbeidsplassen.no og hvordan du kan bruke dem i rekrutteringen.",
    updatedAt: "2025-09-15",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <Arbeidsgivertjenester meta={pageInfo} />;
}
