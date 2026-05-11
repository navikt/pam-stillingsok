import { type ConsentValues, getConsentValues, getUserActionTakenValue } from "@navikt/arbeidsplassen-react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import Informasjonskapsler from "@/app/(artikler)/informasjonskapsler/Informasjonskapsler";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";

const pageInfo: PageInfo = {
    title: "Informasjons\u00ADkapsler på arbeidsplassen.no",
    language: "nn",
    proofread: false,
    category: "privacy-and-terms",
    description:
        "Les om kva informasjonskapslar me bruker, kva dei blir brukte til og korleis du kan administrera innstillingane dine.",
    updatedAt: "2025-12-04",
};

export const metadata: Metadata = buildPageMetadata({
    meta: pageInfo,
});

interface ConsentData {
    consentValues: ConsentValues;
    userActionTaken: boolean | null;
}

export async function getConsentData(cookies: string): Promise<ConsentData> {
    const consentValues = getConsentValues(cookies);
    const userActionTaken = getUserActionTakenValue(cookies);

    return {
        consentValues,
        userActionTaken,
    };
}

export default async function Page() {
    const requestCookie = await cookies();

    const data = await getConsentData(requestCookie.toString());
    return (
        <Informasjonskapsler
            meta={pageInfo}
            consentValues={data.consentValues}
            userActionTaken={data.userActionTaken}
        />
    );
}
