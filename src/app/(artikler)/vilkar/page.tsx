import Vilkar from "@/app/(artikler)/vilkar/Vilkar";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Vilkår for å publisere stillinger",
    language: "nb",
    proofread: true,
    category: "privacy-and-terms",
    description: "Les vilkårene for bruk av arbeidsplassen.no og hvilke rettigheter og plikter du har.",
    updatedAt: "2025-09-29",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <Vilkar meta={pageInfo} />;
}
