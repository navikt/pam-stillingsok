import Informasjonskapsler from "@/app/(artikler)/informasjonskapsler/Informasjonskapsler";
import { cookies } from "next/headers";
import { ConsentValues, getConsentValues, getUserActionTakenValue } from "@navikt/arbeidsplassen-react";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Informasjons\u00ADkapsler på arbeidsplassen.no",
    language: "nb",
    proofread: true,
    category: "privacy-and-terms",
    description:
        "Les om hvilke informasjonskapsler vi bruker, hva de brukes til og hvordan du kan administrere innstillingene dine.",
    updatedAt: "2024-11-23",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
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
            meta={articleMeta}
            consentValues={data.consentValues}
            userActionTaken={data.userActionTaken}
        />
    );
}
