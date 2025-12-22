import SuperraskSoknadBedrift from "@/app/(static)/(artikler)/superrask-soknad-bedrift/SuperraskSoknadBedrift";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(static)/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Nye funksjonar i Superrask søknad – Det er no endå enklare å følgje opp og sortere søknadene du har fått",
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
