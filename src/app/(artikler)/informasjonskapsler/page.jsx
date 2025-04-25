import { getMetadataTitle } from "@/app/metadata";
import Informasjonskapsler from "@/app/(artikler)/informasjonskapsler/Informasjonskapsler";
import { cookies } from "next/headers";
import { CookieBannerUtils } from "@navikt/arbeidsplassen-react";

export const metadata = {
    title: getMetadataTitle("Informasjons­kapsler på arbeidsplassen.no"),
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
