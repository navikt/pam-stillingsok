import SuperraskSoknadPerson from "@/app/(static)/(artikler)/superrask-soknad-person/SuperraskSoknadPerson";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(static)/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Superrask søknad",
    language: "nn",
    proofread: true,
    category: "superrask-soknad",
    description: "Informasjon til jobbsøkjarar om korleis Superrask søknad fungerer og korleis du bruker han.",
    updatedAt: "2025-12-02",
    ogImagePath: "/images/jobbsoker.jpg",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <SuperraskSoknadPerson meta={pageInfo} />;
}
