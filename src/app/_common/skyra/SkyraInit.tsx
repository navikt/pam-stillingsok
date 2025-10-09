"use client";

import Script, { ScriptProps } from "next/script";
import { getConsentValues } from "@navikt/arbeidsplassen-react";
import { SkyraConfig } from "@/app/_common/skyra/skyraRuntime";

export default function SkyraInit() {
    const hasCookieConsent = getConsentValues(document.cookie);
    const skyraConfig: SkyraConfig = {
        org: "arbeids-og-velferdsetaten-nav",
        // Prevents Skyra from setting cookies.
        cookieConsent: hasCookieConsent.surveysConsent,
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
