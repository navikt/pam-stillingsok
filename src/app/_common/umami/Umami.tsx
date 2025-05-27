"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { CookieBannerUtils } from "@navikt/arbeidsplassen-react";
import { umamiTracking } from "@/app/_common/umami/umamiTracking";

const DEV_DOMAIN = "arbeidsplassen.intern.dev.nav.no";
const PROD_DOMAIN = "arbeidsplassen.nav.no";

export default function Umami(): null {
    const [isDev, setIsDev] = useState(false);
    const [isProd, setIsProd] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isAnalyticsEnabled, setIsAnalyticsEnabled] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        if (window.location.hostname === DEV_DOMAIN) {
            setIsDev(true);
        }

        if (window.location.hostname === PROD_DOMAIN) {
            setIsProd(true);
        }

        const consentValues = CookieBannerUtils.getConsentValues();
        setIsAnalyticsEnabled(consentValues.analyticsConsent);
    }, []);

    // Track page view on route change
    useEffect(() => {
        // Dont track if not enabled
        if (!isAnalyticsEnabled || (!isDev && !isProd)) return;

        umamiTracking();
    }, [pathname, searchParams, isAnalyticsEnabled, isDev, isProd]);

    return null;
}
