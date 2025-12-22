import NyttSokefelt from "@/app/(static)/(artikler)/nytt-sokefelt/NyttSokefelt";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(static)/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Nytt søkefelt! Enklere, raskere og mer fleksibelt!",
    language: "nb",
    proofread: true,
    category: "search-and-features",
    description: "Bli kjent med det nye søkefeltet og hvordan det gjør det enklere å finne stillinger og innhold.",
    updatedAt: "2025-05-02",
    ogImagePath: "/images/ansatt.png",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <NyttSokefelt meta={pageInfo} />;
}
