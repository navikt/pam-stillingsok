import PersonvernArbeidsgiver from "@/app/(artikler)/personvern-arbeidsgiver/PersonvernArbeidsgiver";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const pageInfo: PageInfo = {
    title: "Personvernerklæring for deg som representerer en arbeidsgiver",
    language: "nb",
    proofread: true,
    category: "privacy-and-terms",
    description: "Personvernerklæring for arbeidsgivere som bruker arbeidsplassen.no til rekruttering.",
    updatedAt: "2025-04-11",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <PersonvernArbeidsgiver meta={pageInfo} />;
}
