import { getConsentValues } from "@navikt/arbeidsplassen-react";
import { headers } from "next/headers";
import { SkyraScripts } from "@/app/_common/skyra/SkyraScripts";
import { type SkyraConfig, skyraOrg } from "@/app/_common/skyra/skyraRuntime";

declare global {
    interface Window {
        SKYRA_CONFIG?: SkyraConfig;
    }
}

export default async function SkyraInit() {
    const requestHeaders = await headers();
    const nonce = requestHeaders.get("x-nonce") ?? undefined;

    const cookieHeader: string = requestHeaders.get("cookie") ?? "";
    const consent = getConsentValues(cookieHeader);

    return <SkyraScripts nonce={nonce} org={skyraOrg} cookieConsent={consent.skyraConsent} />;
}
