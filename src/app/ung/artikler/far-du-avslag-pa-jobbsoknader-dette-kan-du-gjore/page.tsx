import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import ArticlePage from "@/app/ung/artikler/far-du-avslag-pa-jobbsoknader-dette-kan-du-gjore/ArticlePage";

const pageInfo: PageInfo = {
    title: "Får du avslag på jobbsøknader? Dette kan hjelpe deg videre",
    language: "nb",
    proofread: true,
    category: "ung",
    description:
        "Det kan være tungt å få avslag når du søker jobb, og spesielt hvis du er ny i arbeidslivet. Mange begynner å tvile på seg selv etter flere avslag.",
    updatedAt: "2026-06-05",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <ArticlePage meta={pageInfo} />;
}
