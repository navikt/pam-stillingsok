import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import SuperraskSoknadIServiceOgOppvekstyrker from "@/app/(artikler)/superrask-soknad-i-service-og-oppvekstyrker/SuperraskSoknadIServiceOgOppvekstyrker";

const pageInfo: PageInfo = {
    title: "Superrask søknad mest populært i service- og oppvekstyrker",
    language: "nb",
    proofread: false,
    category: "superrask-soknad",
    description:
        "Superrask søknad blir stadig mer populært. Særlig innen butikk, salg og oppvekstyrker gjør løsningen det enklere å søke jobb.",
    updatedAt: "2026-10-13",
    ogImagePath: "/images/woman-portrait-supermarket.png",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <SuperraskSoknadIServiceOgOppvekstyrker meta={pageInfo} />;
}
