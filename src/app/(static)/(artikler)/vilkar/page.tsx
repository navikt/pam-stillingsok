import Vilkar from "@/app/(static)/(artikler)/vilkar/Vilkar";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(static)/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Vilkår for å publisere stillingar",
    language: "nn",
    proofread: false,
    category: "privacy-and-terms",
    description: "Les vilkåra for bruk av arbeidsplassen.no og kva rettar og plikter du har.",
    updatedAt: "2025-12-02",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <Vilkar meta={pageInfo} />;
}
