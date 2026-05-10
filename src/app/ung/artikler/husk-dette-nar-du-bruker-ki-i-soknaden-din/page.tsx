import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import ArticlePage from "@/app/ung/artikler/husk-dette-nar-du-bruker-ki-i-soknaden-din/ArticlePage";

const pageInfo: PageInfo = {
    title: "Dette må du huske når du bruker KI i søknaden din",
    language: "nb",
    proofread: true,
    category: "ung",
    description:
        "Mange bruker kunstig intelligens (KI) når de skal søke jobb, for eksempel Copilot og ChatGPT. Det kan være nyttig, men vi må som alltid bruke KI på en bevisst og kritisk måte.",
    updatedAt: "2026-04-30",
    ogImagePath: "/images/ki-soknad-ung.jpg",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <ArticlePage meta={pageInfo} />;
}
