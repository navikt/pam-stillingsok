import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import NyttigeArtiklerForJobbsokere from "@/app/(artikler)/nyttige-artikler-for-jobbsokere/NyttigeArtiklerForJobbsokere";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";

const pageInfo: PageInfo = {
    title: "Nyttige artikler for jobbsøkere",
    language: "nb",
    proofread: true,
    category: "jobseeker-guides",
    description: "Samleside med nyttige artikler for jobbsøkere om CV, søknad, intervju og det å finne jobb.",
    updatedAt: "2025-05-02",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <NyttigeArtiklerForJobbsokere meta={pageInfo} />;
}
