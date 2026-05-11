import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import SkyraOmStillingsregistrering from "@/app/tilbakemeldinger/om-stillingsregistrering/SkyraOmStillingsregistrering";

const pageInfo: PageInfo = {
    title: "Gi tilbakemelding om stillingsregistrering",
    language: "nb",
    proofread: true,
    category: "support-and-contact",
    description: "Her har du muligheten til å gi tilbakemelding på stillingsregistrering",
    updatedAt: "2026-02-27",
    excludeFromSiteMap: true,
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
        },
    },
});

export default async function Page() {
    return <SkyraOmStillingsregistrering meta={pageInfo} />;
}
