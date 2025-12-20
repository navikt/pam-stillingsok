import PersonvernArbeidsgiver from "@/app/(static)/(artikler)/personvern-arbeidsgiver/PersonvernArbeidsgiver";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(static)/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Personvernerklæring for deg som representerer ein arbeidsgivar",
    language: "nn",
    proofread: false,
    category: "privacy-and-terms",
    description: "Personvernerklæring for arbeidsgivarar som bruker arbeidsplassen.no til rekruttering.",
    updatedAt: "2025-12-04",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <PersonvernArbeidsgiver meta={pageInfo} />;
}
