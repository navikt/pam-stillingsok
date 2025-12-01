import SuperraskSoknadBedrift from "@/app/(artikler)/superrask-soknad-bedrift/SuperraskSoknadBedrift";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Nye funksjoner i Superrask søknad – Det er nå enda enklere å følge opp og sortere søknadene du har mottatt",
    metaTitle: "Superrask søknad – ein enklare måte å komme i kontakt med relevante jobbsøkjarar",
    language: "nn",
    proofread: false,
    category: "superrask-soknad",
    description: "Informasjon til bedrifter om korleis Superrask søknad fungerer og kan brukast i rekruttering.",
    updatedAt: "2025-12-02",
    ogImagePath: "/images/bedrift.jpg",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <SuperraskSoknadBedrift meta={pageInfo} />;
}
