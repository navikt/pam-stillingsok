import Informasjonskapsler from "@/app/(artikler)/informasjonskapsler/Informasjonskapsler";
import { cookies } from "next/headers";
import { ConsentValues, getConsentValues, getUserActionTakenValue } from "@navikt/arbeidsplassen-react";

export const metadata = {
    title: "Informasjonskapsler på arbeidsplassen.no",
};

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
    return <Informasjonskapsler consentValues={data.consentValues} userActionTaken={data.userActionTaken} />;
}
