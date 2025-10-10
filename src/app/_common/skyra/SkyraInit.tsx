"use client";

import Script, { ScriptProps } from "next/script";
import { getConsentValues } from "@navikt/arbeidsplassen-react";
import { SkyraConfig, skyraOrg } from "@/app/_common/skyra/skyraRuntime";

export default function SkyraInit() {
    const cookieStr = typeof document !== "undefined" ? document.cookie : null;
    const hasCookieConsent = getConsentValues(cookieStr);
    const skyraConfig: SkyraConfig = {
        org: skyraOrg,
        // Prevents Skyra from setting cookies.
        cookieConsent: hasCookieConsent.skyraConsent,
    };

    const scriptConfig: ScriptProps = {
        id: "skyra-config",
        strategy: "afterInteractive",
    };

    return (
        <>
            <Script {...scriptConfig}>{`window.SKYRA_CONFIG = ${JSON.stringify(skyraConfig)};`}</Script>
            <Script src="https://survey.skyra.no/skyra-survey.js" strategy="afterInteractive" />
        </>
    );
}
