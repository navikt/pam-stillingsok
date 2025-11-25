import SporsmalOgSvar from "@/app/(artikler)/sporsmal-og-svar/SporsmalOgSvar";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Spørsmål og svar",
    language: "nb",
    proofread: true,
    category: "support-and-contact",
    description: "Ofte stilte spørsmål og svar om arbeidsplassen.no for jobbsøkere og arbeidsgivere.",
    updatedAt: "2023-01-16",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <SporsmalOgSvar meta={articleMeta} />;
}
