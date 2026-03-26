import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import React from "react";
import ArticlePage from "@/app/ung/artikler/5-tips-til-deg-som-skal-soke-sommerjobb/ArticlePage";

const pageInfo: PageInfo = {
    title: "5 tips til deg som skal søke sommerjobb",
    language: "nb",
    proofread: true,
    category: "ung",
    description: "En god søknad handler mer om motivasjon enn erfaring. Her er tipsene som hjelper deg i gang.",
    updatedAt: "2026-03-27",
    ogImagePath: "/images/jobbsoker.jpg",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <ArticlePage meta={pageInfo} />;
}
