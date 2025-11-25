import SuperraskSoknadBedrift from "@/app/(artikler)/superrask-soknad-bedrift/SuperraskSoknadBedrift";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Nye funksjoner i Superrask søknad – Det er nå enda enklere å følge opp og sortere søknadene du har mottatt",
    metaTitle: "Superrask søknad – en enklere måte å komme i kontakt med relevante jobbsøkere",
    language: "nb",
    proofread: true,
    category: "superrask-soknad",
    description: "Informasjon til bedrifter om hvordan Superrask søknad fungerer og kan brukes i rekruttering.",
    updatedAt: "2023-01-16",
    ogImagePath: "/images/bedrift.jpg",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <SuperraskSoknadBedrift meta={articleMeta} />;
}
