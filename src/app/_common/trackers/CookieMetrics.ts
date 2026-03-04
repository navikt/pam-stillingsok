"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getUserActionTakenValue, getConsentValues } from "@navikt/arbeidsplassen-react";
import { removeUuid } from "@/app/_common/utils/removeUuid";
import { trackMetricsClient } from "@/features/metrics/trackMetricsClient";

type CookieConsentAction = "no-action" | "accepted-analytics" | "not-accepted-analytics";

const resolveCookieConsentAction = (cookieString: string): CookieConsentAction => {
    const userActionTaken = getUserActionTakenValue(cookieString) ?? false;
    const hasCookieConsent: { analyticsConsent: boolean } = getConsentValues(cookieString);

    if (hasCookieConsent.analyticsConsent) {
        return "accepted-analytics";
    }

    if (userActionTaken && !hasCookieConsent.analyticsConsent) {
        return "not-accepted-analytics";
    }

    return "no-action";
};

function makeDedupeKey(cleanedPath: string, actionValue: CookieConsentAction): string {
    return `telemetry:cookie-consent:${cleanedPath}:${actionValue}`;
}

export default function CookieMetrics(): null {
    const pathname = usePathname();

    useEffect(() => {
        const cookieString = document.cookie;
        const actionValue = resolveCookieConsentAction(cookieString);

        // Vi holder oss til path uten query for å redusere antall unike paths i metrikkene
        const cleanedPath = removeUuid(pathname);
        const dedupeKey = makeDedupeKey(cleanedPath, actionValue);
        // Dedupe per session: sender kun én gang per path + action
        if (sessionStorage.getItem(dedupeKey) === "1") {
            return;
        }
        sessionStorage.setItem(dedupeKey, "1");
        trackMetricsClient("Valg - Cookie samtykke", {
            action: actionValue,
            path: cleanedPath,
        });
    }, [pathname]);

    return null;
}
