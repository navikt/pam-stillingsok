import Personvern from "@/app/(artikler)/personvern/Personvern";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Personvernerklæring for arbeidsplassen.no",
    language: "nb",
    proofread: true,
    category: "privacy-and-terms",
    description: "Les om hvordan vi behandler personopplysninger når du bruker arbeidsplassen.no.",
    updatedAt: "2024-11-23",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <Personvern meta={articleMeta} />;
}
