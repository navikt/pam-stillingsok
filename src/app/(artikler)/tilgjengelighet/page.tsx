import Tilgjengelighet from "@/app/(artikler)/tilgjengelighet/Tilgjengelighet";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Tilgjengelighet",
    language: "nb",
    proofread: true,
    category: "about-service",
    description:
        "Her finner du informasjon om tilgjengeligheten på arbeidsplassen.no og hvordan vi jobber med universell utforming.",
    updatedAt: "2025-04-11",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <Tilgjengelighet meta={pageInfo} />;
}
