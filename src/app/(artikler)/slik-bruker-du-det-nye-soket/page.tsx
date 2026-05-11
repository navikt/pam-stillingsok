import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import NyttSok from "@/app/(artikler)/slik-bruker-du-det-nye-soket/NyttSok";

const pageInfo: PageInfo = {
    title: "Slik bruker du det nye søket",
    language: "nb",
    proofread: true,
    category: "search-and-features",
    description: "Slik bruker du det nye søket på arbeidsplassen.no for å finne relevante stillinger og innhold.",
    updatedAt: "2025-04-23",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <NyttSok meta={pageInfo} />;
}
