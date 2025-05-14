"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { CookieBannerUtils } from "@navikt/arbeidsplassen-react";
import { getWebsiteId } from "@/app/_common/umami/getWebsiteId";

const DEV_DOMAIN = "arbeidsplassen.intern.dev.nav.no";
const PROD_DOMAIN = "arbeidsplassen.nav.no";

export default function Umami(): JSX.Element | null {
    const [isDev, setIsDev] = useState(false);
    const [isProd, setIsProd] = useState(false);
    const websiteId = getWebsiteId();
    const [umamiDomain, setUmamiDomain] = useState(DEV_DOMAIN);
    const [isAnalyticsEnabled, setIsAnalyticsEnabled] = useState(false);

    useEffect(() => {
        if (window?.location?.hostname === DEV_DOMAIN) {
            setIsDev(true);
        }

        if (window?.location?.hostname === PROD_DOMAIN) {
            setIsProd(true);
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
