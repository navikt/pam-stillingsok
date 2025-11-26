import Utlogget from "@/app/(artikler)/utlogget/Utlogget";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const pageInfo: PageInfo = {
    title: "Du er nå logget ut",
    language: "nb",
    proofread: true,
    category: "auth-flow",
    description: "Du er logget ut av arbeidsplassen.no. Logg inn igjen for å fortsette der du slapp.",
    updatedAt: "2025-04-11",
    excludeFromSiteMap: true,
};

export const metadata: Metadata = buildArticleMetadata({
    meta: pageInfo,
});

export default function Page({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
    const timeout: boolean = searchParams?.timeout === "true";
    return <Utlogget meta={pageInfo} timeout={timeout} />;
}
