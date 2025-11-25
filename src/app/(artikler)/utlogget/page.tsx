import Utlogget from "@/app/(artikler)/utlogget/Utlogget";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Du er nå logget ut",
    language: "nb",
    proofread: true,
    category: "auth-flow",
    description: "Du er logget ut av arbeidsplassen.no. Logg inn igjen for å fortsette der du slapp.",
    updatedAt: "2025-05-16",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
    const timeout: boolean = searchParams?.timeout === "true";
    return <Utlogget meta={articleMeta} timeout={timeout} />;
}
