import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Nettstedkart } from "./Nettstedkart";

const pageInfo: PageInfo = {
    title: "Nettstedkart",
    language: "nb",
    proofread: true,
    category: "about-service",
    excludeFromSiteMap: true,
    description: "Oversikt over artikler, hjelpesider og informasjon på arbeidsplassen.no.",
    updatedAt: "2025-05-16",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function NettstedkartPage() {
    return <Nettstedkart meta={pageInfo} />;
}
