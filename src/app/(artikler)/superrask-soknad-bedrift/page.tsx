import SuperraskSoknadBedrift from "@/app/(artikler)/superrask-soknad-bedrift/SuperraskSoknadBedrift";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Nye funksjoner i Superrask søknad – Det er nå enda enklere å følge opp og sortere søknadene du har mottatt",
    metaTitle: "Superrask søknad – en enklere måte å komme i kontakt med relevante jobbsøkere",
    language: "nb",
    proofread: true,
    category: "superrask-soknad",
    description: "Informasjon til bedrifter om hvordan Superrask søknad fungerer og kan brukes i rekruttering.",
    updatedAt: "2023-05-02",
    ogImagePath: "/images/bedrift.jpg",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <SuperraskSoknadBedrift meta={pageInfo} />;
}
