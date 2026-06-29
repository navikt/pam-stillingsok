import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import ArticlePage from "@/app/ung/artikler/superrask-soknad-sok-pa-jobben/ArticlePage";

const pageInfo: PageInfo = {
    title: "Superrask søknad: søk på jobben med bare noen klikk!",
    language: "nb",
    proofread: true,
    category: "ung",
    description: "Er du på jakt etter sommerjobb? Eller kanskje du leter etter din aller første jobb?",
    updatedAt: "2026-06-29",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <ArticlePage meta={pageInfo} />;
}
