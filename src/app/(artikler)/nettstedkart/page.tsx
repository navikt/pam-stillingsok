import type { Metadata } from "next";
import { Nettstedkart } from "./Nettstedkart";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const pageInfo: PageInfo = {
    title: "Nettstedkart",
    language: "nb",
    proofread: true,
    category: "about-service",
    excludeFromSiteMap: true,
    description: "Oversikt over artikler, hjelpesider og informasjon på arbeidsplassen.no.",
    updatedAt: "2025-05-16",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: pageInfo,
});

export default function NettstedkartPage(): JSX.Element {
    return <Nettstedkart meta={pageInfo} />;
}
