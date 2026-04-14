import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import React from "react";
import ArticlePage from "@/app/ung/artikler/blitt-ghosta-av-arbeidsgiver-hva-na/ArticlePage";

const pageInfo: PageInfo = {
    title: "Blitt ghosta av arbeidsgiver? Hva nå?",
    language: "nb",
    proofread: true,
    category: "ung",
    description:
        "Blitt ghosta av arbeidsgiver? Her får du råd om hva du kan gjøre når du ikke får svar etter å ha søkt jobb, og hvordan du kommer videre.",
    updatedAt: "2026-04-10",
    ogImagePath: "/images/writing.jpg",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <ArticlePage meta={pageInfo} />;
}
