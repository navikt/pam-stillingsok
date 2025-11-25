import PersonvernArbeidsgiver from "@/app/(artikler)/personvern-arbeidsgiver/PersonvernArbeidsgiver";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Personvernerklæring for deg som representerer en arbeidsgiver",
    language: "nb",
    proofread: true,
    category: "privacy-and-terms",
    description: "Personvernerklæring for arbeidsgivere som bruker arbeidsplassen.no til rekruttering.",
    updatedAt: "2024-11-23",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <PersonvernArbeidsgiver meta={articleMeta} />;
}
