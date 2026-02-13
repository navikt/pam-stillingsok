import Script from "next/script";
import { createSkyraInlineConfig } from "./skyraConfig";

type SkyraScriptsProps = Readonly<{
    nonce?: string;
    org: string;
    cookieConsent: boolean;
}>;

export function SkyraScripts({ nonce, org, cookieConsent }: SkyraScriptsProps) {
    const inlineConfig = createSkyraInlineConfig({ org, cookieConsent });

    return (
        <>
            <Script id="skyra-config" strategy="afterInteractive" nonce={nonce}>
                {inlineConfig}
            </Script>
            <Script
                id="skyra-survey"
                src="https://survey.skyra.no/skyra-survey.js"
                strategy="afterInteractive"
                nonce={nonce}
            />
        </>
    );
}
