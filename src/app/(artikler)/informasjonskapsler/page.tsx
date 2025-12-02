import Informasjonskapsler from "@/app/(artikler)/informasjonskapsler/Informasjonskapsler";
import { cookies } from "next/headers";
import { ConsentValues, getConsentValues, getUserActionTakenValue } from "@navikt/arbeidsplassen-react";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";

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
    const cookiesValue = await cookies().toString();
    const data = await getConsentData(cookiesValue);
    return (
        <Informasjonskapsler
            meta={pageInfo}
            consentValues={data.consentValues}
            userActionTaken={data.userActionTaken}
        />
    );
}
