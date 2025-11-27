import SuperraskSoknadPerson from "@/app/(artikler)/superrask-soknad-person/SuperraskSoknadPerson";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Superrask søknad",
    language: "nb",
    proofread: true,
    category: "superrask-soknad",
    description: "Informasjon til jobbsøkere om hvordan Superrask søknad fungerer og hvordan du bruker den.",
    updatedAt: "2025-05-02",
    ogImagePath: "/images/jobbsoker.jpg",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <SuperraskSoknadPerson meta={pageInfo} />;
}
