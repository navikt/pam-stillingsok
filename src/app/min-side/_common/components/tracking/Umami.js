"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { CookieBannerUtils } from "@navikt/arbeidsplassen-react";

const DEV_DOMAIN = "arbeidsplassen.intern.dev.nav.no";
const PROD_DOMAIN = "arbeidsplassen.nav.no";

export default function Umami() {
    const [isDev, setIsDev] = useState(false);
    const [isProd, setIsProd] = useState(false);
    const [websiteId, setWebsiteId] = useState("1cc70e4f-bb41-4d28-8115-cbbc32bee4d3");
    const [umamiDomain, setUmamiDomain] = useState(DEV_DOMAIN);
    const [isAnalyticsEnabled, setIsAnalyticsEnabled] = useState(false);

    useEffect(() => {
        if (window?.location?.hostname === DEV_DOMAIN) {
            setIsDev(true);
        }

        if (window?.location?.hostname === PROD_DOMAIN) {
            setIsProd(true);
            setWebsiteId("c2f0a46d-a5b4-4370-8b80-b9b9fcd39f96");
            setUmamiDomain(PROD_DOMAIN);
        }
        const consentValues = CookieBannerUtils.getConsentValues();
        setIsAnalyticsEnabled(consentValues.analyticsConsent);
    }, []);

    if (!isDev && !isProd) {
        return null;
    }

    if (!isAnalyticsEnabled) {
        return null;
    }

    return (
        <Script
            defer
            src="https://cdn.nav.no/team-researchops/sporing/sporing.js"
            data-host-url="https://umami.nav.no"
            data-website-id={websiteId}
            data-domains={umamiDomain}
        />
    );
}
