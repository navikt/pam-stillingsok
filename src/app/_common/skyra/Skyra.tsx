"use client";

import Script, { ScriptProps } from "next/script";

interface SkyraConfig {
    org: string;
}

declare global {
    interface Window {
        SKYRA_CONFIG: SkyraConfig;
    }
}

export default function SkyraInit() {
    const skyraConfig: SkyraConfig = {
        org: "arbeids-og-velferdsetaten-nav",
    };

    const scriptConfig: ScriptProps = {
        id: "skyra-config",
        strategy: "afterInteractive",
    };

    return (
        <>
            <Script {...scriptConfig}>{`window.SKYRA_CONFIG = ${JSON.stringify(skyraConfig)};`}</Script>
            <Script src="https://survey.skyra.no/skyra-survey.js" defer strategy="afterInteractive" />
        </>
    );
}
