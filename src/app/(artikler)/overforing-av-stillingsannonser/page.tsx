import OverforingAvStillingsannonser from "@/app/(artikler)/overforing-av-stillingsannonser/OverforingAvStillingsannonser";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const pageInfo: PageInfo = {
    title: "Overføring av stillingsannonser til arbeidsplassen.no",
    language: "nb",
    proofread: true,
    category: "api-and-integrations",
    description: "Informasjon om overføring av stillingsannonser fra egne systemer til arbeidsplassen.no.",
    updatedAt: "2025-04-11",
    ogImagePath: "/images/api.png",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <OverforingAvStillingsannonser meta={pageInfo} />;
}
