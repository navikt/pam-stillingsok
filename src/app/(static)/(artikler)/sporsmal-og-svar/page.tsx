import SporsmalOgSvar from "@/app/(static)/(artikler)/sporsmal-og-svar/SporsmalOgSvar";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(static)/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Spørsmål og svar",
    language: "nb",
    proofread: true,
    category: "support-and-contact",
    description: "Ofte stilte spørsmål og svar om arbeidsplassen.no for jobbsøkere og arbeidsgivere.",
    updatedAt: "2025-10-22",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <SporsmalOgSvar meta={pageInfo} />;
}
