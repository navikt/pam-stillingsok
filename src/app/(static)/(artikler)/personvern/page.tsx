import Personvern from "@/app/(static)/(artikler)/personvern/Personvern";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(static)/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Personvernerklæring for arbeidsplassen.no",
    language: "nn",
    proofread: false,
    category: "privacy-and-terms",
    description: "Les om korleis vi behandlar personopplysningar når du bruker arbeidsplassen.no.",
    updatedAt: "2025-12-02",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <Personvern meta={pageInfo} />;
}
