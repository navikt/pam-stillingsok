import Personvern from "@/app/(artikler)/personvern/Personvern";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Personvernerklæring for arbeidsplassen.no",
    language: "nb",
    proofread: true,
    category: "privacy-and-terms",
    description: "Les om hvordan vi behandler personopplysninger når du bruker arbeidsplassen.no.",
    updatedAt: "2025-10-17",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <Personvern meta={pageInfo} />;
}
