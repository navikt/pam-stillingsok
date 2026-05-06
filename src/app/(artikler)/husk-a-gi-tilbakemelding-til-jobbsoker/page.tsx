import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import HuskAGiTilbakemeldingTilJobbsoker from "@/app/(artikler)/husk-a-gi-tilbakemelding-til-jobbsoker/HuskAGiTilbakemeldingTilJobbsoker";

const pageInfo: PageInfo = {
    title: "Når dere ikke gir tilbakemelding – slik oppleves det for unge jobbsøkere",
    language: "nb",
    proofread: true,
    category: "employer-guides",
    description:
        "Mange unge legger mye tid, motivasjon og håp i en jobbsøknad. Når de ikke får svar, oppleves det som å bli ghostet – en total stillhet som skaper usikkerhet og gjør det vanskelig å forstå hva som egentlig skjer i prosessen.",
    updatedAt: "2026-04-22",
    ogImagePath: "/images/ghostet.jpg",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <HuskAGiTilbakemeldingTilJobbsoker meta={pageInfo} />;
}
