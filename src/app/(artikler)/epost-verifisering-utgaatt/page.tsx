import EpostVerifiseringUtgaatt from "@/app/(artikler)/epost-verifisering-utgaatt/EpostVerifiseringUtgaatt";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Lenken er dessverre utgått",
    language: "nb",
    proofread: true,
    category: "auth-flow",
    description: "Lenken for e-postverifisering er utgått. Her får du hjelp til å bekrefte e-posten din på nytt.",
    updatedAt: "2024-11-23",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <EpostVerifiseringUtgaatt meta={articleMeta} />;
}
