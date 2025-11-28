import Arbeidsgivertjenester from "@/app/(artikler)/arbeidsgivertjenester/Arbeidsgivertjenester";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import { Metadata } from "next";

const pageInfo: PageInfo = {
    title: "Kven kan bruke arbeidsgivartenestene?",
    language: "nn",
    proofread: false,
    category: "employer-guides",
    description:
        "Få oversikt over arbeidsgivartenestene på arbeidsplassen.no og korleis du kan bruke dei i rekrutteringa.",
    updatedAt: "2025-12-03",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <Arbeidsgivertjenester meta={pageInfo} />;
}
