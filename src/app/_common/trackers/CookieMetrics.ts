"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getUserActionTakenValue, getConsentValues } from "@navikt/arbeidsplassen-react";

export default function CookieMetrics(): null {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
            return;
        }

        let actionValue = "no-action";

        const userActionTaken = getUserActionTakenValue(document.cookie) ?? false;
        const hasCookieConsent: { analyticsConsent: boolean } = getConsentValues(document.cookie);

        if (hasCookieConsent.analyticsConsent) {
            actionValue = "accepted-analytics";
        } else if (userActionTaken && !hasCookieConsent.analyticsConsent) {
            actionValue = "not-accepted-analytics";
        }

        fetch("/api/internal/metrics", {
            method: "POST",
            body: JSON.stringify({
                cookieConsent: actionValue,
                method: "GET",
                path: pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ""),
            }),
        });

        console.log("CookieMetrics:", { actionValue, path: pathname });
    }, [pathname, searchParams]);

    return null;
}
