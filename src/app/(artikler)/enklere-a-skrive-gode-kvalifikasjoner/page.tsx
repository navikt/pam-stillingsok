import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import EnklereASkriveGodeKvalifikasjoner from "@/app/(artikler)/enklere-a-skrive-gode-kvalifikasjoner/EnklereASkriveGodeKvalifikasjoner";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";

const pageInfo: PageInfo = {
    title: "Nå er det enklere enn noensinne å skrive gode kvalifikasjoner og overskrifter til din jobbannonse",
    language: "nn",
    proofread: true,
    category: "employer-guides",
    description:
        "Lær å skrive tydelige og relevante kvalifikasjoner som gjør stillingsannonsen enklere å forstå for jobbsøkere.",
    updatedAt: "2025-05-02",
    ogImagePath: "/images/dog.png",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <EnklereASkriveGodeKvalifikasjoner meta={pageInfo} />;
}
