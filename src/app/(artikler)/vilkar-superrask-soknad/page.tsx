import VilkarSuperraskSoknad from "@/app/(artikler)/vilkar-superrask-soknad/VilkarSuperraskSoknad";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Vilkår for bruk av superrask søknad",
    language: "nb",
    proofread: true,
    category: "superrask-soknad",
    description: "Vilkår for bruk av Superrask søknad for arbeidsgivere og jobbsøkere.",
    updatedAt: "2025-05-16",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <VilkarSuperraskSoknad meta={articleMeta} />;
}
