import Informasjonskapsler from "@/app/(artikler)/informasjonskapsler/Informasjonskapsler";
import { cookies } from "next/headers";
import { CookieBannerUtils } from "@navikt/arbeidsplassen-react";

export const metadata = {
    title: "Informasjonskapsler på arbeidsplassen.no",
};

export async function getConsentData(cookies) {
    const consentValues = CookieBannerUtils.getConsentValues(cookies);
    const userActionTaken = CookieBannerUtils.getUserActionTakenValue(cookies);

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
