import OverforingAvStillingsannonser from "@/app/(artikler)/overforing-av-stillingsannonser/OverforingAvStillingsannonser";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Overføring av stillingsannonser til arbeidsplassen.no",
    language: "nb",
    proofread: true,
    category: "api-and-integrations",
    description: "Informasjon om overføring av stillingsannonser fra egne systemer til arbeidsplassen.no.",
    updatedAt: "2024-11-23",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <OverforingAvStillingsannonser meta={articleMeta} />;
}
