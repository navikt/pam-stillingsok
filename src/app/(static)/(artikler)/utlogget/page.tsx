import Utlogget from "@/app/(static)/(artikler)/utlogget/Utlogget";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(static)/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Du er nå logget ut",
    language: "nb",
    proofread: true,
    category: "auth-flow",
    description: "Du er logget ut av arbeidsplassen.no. Logg inn igjen for å fortsette der du slapp.",
    updatedAt: "2025-04-11",
    excludeFromSiteMap: true,
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default async function Page(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
    const searchParams = await props.searchParams;
    const timeout: boolean = searchParams?.timeout === "true";
    return <Utlogget meta={pageInfo} timeout={timeout} />;
}
