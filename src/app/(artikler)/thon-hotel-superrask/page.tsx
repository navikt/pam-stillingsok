import ThonHotelSuperrask from "@/app/(artikler)/thon-hotel-superrask/ThonHotelSuperrask";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Ansatte sommervikarer med superrask søknad",
    language: "nb",
    proofread: true,
    category: "superrask-soknad",
    description:
        "Les om hvordan Thon Hotels bruker Superrask søknad i rekrutteringen, og hvilke erfaringer de har gjort.",
    updatedAt: "2025-05-16",
    ogImagePath: "/images/ThonHotel.jpg",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <ThonHotelSuperrask meta={articleMeta} />;
}
