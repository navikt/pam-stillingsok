import SkikkeligBraStillingsannonse from "@/app/(artikler)/skikkelig-bra-stillingsannonse/SkikkeligBraStillingsannonse";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Hvordan skriver du en skikkelig bra stillingsannonse?",
    language: "nb",
    proofread: true,
    category: "employer-guides",
    description: "Lær hvordan du skriver en skikkelig bra stillingsannonse som treffer riktige kandidater.",
    updatedAt: "2025-05-02",
    ogImagePath: "/images/stillingsannonse.jpg",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <SkikkeligBraStillingsannonse meta={pageInfo} />;
}
