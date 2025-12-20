import NyttigeArtiklerForJobbsokere from "@/app/(static)/(artikler)/nyttige-artikler-for-jobbsokere/NyttigeArtiklerForJobbsokere";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(static)/(artikler)/buildPageMetadata";

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
