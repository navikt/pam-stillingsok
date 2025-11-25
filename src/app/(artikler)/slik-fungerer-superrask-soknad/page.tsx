import SlikFungererSuperraskSoknad from "@/app/(artikler)/slik-fungerer-superrask-soknad/SlikFungererSuperraskSoknad";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Slik fungerer Superrask søknad",
    language: "nb",
    proofread: true,
    category: "superrask-soknad",
    description: "Forklaring av hvordan Superrask søknad fungerer for jobbsøkere og arbeidsgivere.",
    updatedAt: "2023-01-16",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <SlikFungererSuperraskSoknad meta={articleMeta} />;
}
