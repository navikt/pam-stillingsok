import Kontakt from "@/app/(artikler)/kontakt/_components/Kontakt";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Kontakt oss",
    language: "nb",
    proofread: true,
    category: "support-and-contact",
    description: "Finn kontaktinformasjon og måter å nå oss på hvis du trenger hjelp med arbeidsplassen.no.",
    updatedAt: "2024-11-23",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <Kontakt meta={articleMeta} />;
}
