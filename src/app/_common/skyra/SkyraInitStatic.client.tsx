"use client";

import { useMemo } from "react";
import { getConsentValues } from "@navikt/arbeidsplassen-react";
import { skyraOrg } from "@/app/_common/skyra/skyraRuntime";
import { SkyraScripts } from "@/app/_common/skyra/SkyraScripts";
import type { ReactElement } from "react";

export default function SkyraInitStaticClient(): ReactElement | null {
    const cookieString = typeof document !== "undefined" ? document.cookie : "";

    const cookieConsent = useMemo(() => {
        const consent = getConsentValues(cookieString);
        return consent.skyraConsent;
    }, [cookieString]);

    // Ingen nonce på static-sider (CSP må tillate dette uten nonce)
    return <SkyraScripts org={skyraOrg} cookieConsent={cookieConsent} />;
}
