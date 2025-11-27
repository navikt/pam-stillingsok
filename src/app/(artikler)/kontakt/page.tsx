import Kontakt from "@/app/(artikler)/kontakt/_components/Kontakt";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Kontakt oss",
    language: "nb",
    proofread: true,
    category: "support-and-contact",
    description: "Finn kontaktinformasjon og måter å nå oss på hvis du trenger hjelp med arbeidsplassen.no.",
    updatedAt: "2025-04-11",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <Kontakt meta={pageInfo} />;
}
