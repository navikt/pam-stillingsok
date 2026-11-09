import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import Julejobb from "@/app/(artikler)/julejobb/Julejobb";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";

const pageInfo: PageInfo = {
    title: "Trenger dere julehjelp?",
    language: "nb",
    proofread: false,
    category: "search-and-features",
    description:
        "Det nye julejobbfilteret på arbeidsplassen.no gjør det enklere å nå kandidater som søker sesongarbeid i juleperioden.",
    updatedAt: "2026-11-09",
    ogImagePath: "/images/florist-training.jpeg",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <Julejobb meta={pageInfo} />;
}
