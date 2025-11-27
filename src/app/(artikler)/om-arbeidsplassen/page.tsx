import OmArbeidsplassen from "@/app/(artikler)/om-arbeidsplassen/OmArbeidsplassen";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Om arbeidsplassen.no",
    language: "nb",
    proofread: true,
    category: "about-service",
    description: "Les om arbeidsplassen.no, hvem tjenesten er for og hvordan vi kobler jobbsøkere og arbeidsgivere.",
    updatedAt: "2025-04-11",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <OmArbeidsplassen meta={pageInfo} />;
}
