import ThonHotelSuperrask from "@/app/(artikler)/thon-hotel-superrask/ThonHotelSuperrask";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";

const pageInfo: PageInfo = {
    title: "Ansatte sommervikarer med superrask søknad",
    language: "nb",
    proofread: true,
    category: "superrask-soknad",
    description:
        "Les om hvordan Thon Hotels bruker Superrask søknad i rekrutteringen, og hvilke erfaringer de har gjort.",
    updatedAt: "2025-04-23",
    ogImagePath: "/images/ThonHotel.jpg",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <ThonHotelSuperrask meta={pageInfo} />;
}
