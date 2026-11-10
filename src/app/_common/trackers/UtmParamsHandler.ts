"use client";

import { getConsentValues, getUserActionTakenValue } from "@navikt/arbeidsplassen-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useCookieBannerContext } from "@/app/_common/cookie-banner/CookieBannerContext";
import { track } from "@/app/_common/umami";

export function UtmParamsHandler() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { showCookieBanner } = useCookieBannerContext();

    useEffect(() => {
        const { analyticsConsent } = getConsentValues();
        if (!analyticsConsent && !getUserActionTakenValue(document.cookie)) {
            return;
        }

        const params = new URLSearchParams(window.location.search);

        if (params.has("utm_source") || params.has("utm_campaign")) {
            const utmSource = params.get("utm_source") || "";
            const utmCampaign = params.get("utm_campaign") || "";

            if (analyticsConsent) {
                track("utm", { source: utmSource, campaign: utmCampaign });
            }

            params.delete("utm_source");
            params.delete("utm_campaign");

            const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;

            window.history.replaceState(window.history.state, "", `${newUrl}${window.location.hash}`);
        }
    }, [pathname, searchParams, showCookieBanner]);

    return null;
}
