import SuperraskSoknadBedrift from "@/app/(artikler)/superrask-soknad-bedrift/SuperraskSoknadBedrift";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Nye funksjonar i Superrask søknad – Det er no endå enklare å følgje opp og sortere søknadene du har fått",
    metaTitle: "Superrask søknad – ein enklare måte å komme i kontakt med relevante jobbsøkjarar",
    language: "nn",
    proofread: false,
    category: "superrask-soknad",
    description: "Informasjon til bedrifter om korleis Superrask søknad fungerer og kan brukast i rekruttering.",
    updatedAt: "2025-02-12",
    ogImagePath: "/images/bedrift.jpg",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <SuperraskSoknadBedrift meta={pageInfo} />;
}
