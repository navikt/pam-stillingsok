import type { Metadata } from "next";
import Arbeidsgivertjenester from "@/app/(artikler)/arbeidsgivertjenester/Arbeidsgivertjenester";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";

const pageInfo: PageInfo = {
    title: "Hvem kan bruke arbeidsgivertjenestene?",
    language: "nb",
    proofread: false,
    category: "employer-guides",
    description:
        "Få oversikt over arbeidsgivertjenestene på arbeidsplassen.no og hvordan du kan bruke dem i rekrutteringen.",
    updatedAt: "2026-11-12",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <Arbeidsgivertjenester meta={pageInfo} />;
}
