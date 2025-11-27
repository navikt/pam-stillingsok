import Script from "next/script";
import { headers } from "next/headers";
import { getConsentValues } from "@navikt/arbeidsplassen-react";
import { skyraOrg, type SkyraConfig } from "@/app/_common/skyra/skyraRuntime";

declare global {
    interface Window {
        SKYRA_CONFIG?: SkyraConfig;
    }
}

export default function SkyraInit() {
    const nonce = headers().get("x-nonce") ?? undefined;

    const cookieHeader: string = headers().get("cookie") ?? "";
    const consent = getConsentValues(cookieHeader);

    const skyraConfig: SkyraConfig = {
        org: skyraOrg,
        cookieConsent: consent.skyraConsent,
    };

    const inlineConfig = `window.SKYRA_CONFIG = ${JSON.stringify(skyraConfig)};`;

    return (
        <>
            <Script
                id="skyra-config"
                strategy="afterInteractive"
                nonce={nonce}
                dangerouslySetInnerHTML={{ __html: inlineConfig }}
            />
            <Script src="https://survey.skyra.no/skyra-survey.js" strategy="afterInteractive" nonce={nonce} />
        </>
    );
}
