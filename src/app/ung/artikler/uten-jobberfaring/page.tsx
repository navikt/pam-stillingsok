import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import UtenJobberfaring from "@/app/ung/artikler/uten-jobberfaring/UtenJobberfaring";

const pageInfo: PageInfo = {
    title: "Få jobb uten jobberfaring? Ja, det er mulig!",
    language: "nb",
    proofread: true,
    category: "ung",
    description:
        "Mangler du jobberfaring? Få 5 enkle tips til hvordan du finner din første jobb, skriver søknad og viser fram erfaringen du allerede har.",
    updatedAt: "2026-27-10",
    ogImagePath: "/images/woman-interview.jpeg",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

export default function Page() {
    return <UtenJobberfaring meta={pageInfo} />;
}
