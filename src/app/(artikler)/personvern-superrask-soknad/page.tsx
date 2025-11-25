import PersonvernSuperraskSoknad from "@/app/(artikler)/personvern-superrask-soknad/PersonvernSuperraskSoknad";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Personvernerklæring for superrask søknad",
    language: "nb",
    proofread: true,
    category: "privacy-and-terms",
    description: "Personvernerklæring for deg som bruker Superrask søknad til å søke på stillinger.",
    updatedAt: "2023-01-16",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <PersonvernSuperraskSoknad meta={articleMeta} />;
}
