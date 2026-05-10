import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import SporsmalOgSvar from "@/app/(artikler)/sporsmal-og-svar/SporsmalOgSvar";

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
