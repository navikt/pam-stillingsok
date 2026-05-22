import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import OverforingAvStillingsannonser from "@/app/(artikler)/overforing-av-stillingsannonser/OverforingAvStillingsannonser";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";

const pageInfo: PageInfo = {
    title: "Overføring av stillingsannonser til arbeidsplassen.no",
    language: "nb",
    proofread: true,
    category: "api-and-integrations",
    description: "Informasjon om overføring av stillingsannonser fra egne systemer til arbeidsplassen.no.",
    updatedAt: "2025-04-11",
    ogImagePath: "/images/api.png",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <OverforingAvStillingsannonser meta={pageInfo} />;
}
