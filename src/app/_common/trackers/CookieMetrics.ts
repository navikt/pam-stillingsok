"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getUserActionTakenValue, getConsentValues } from "@navikt/arbeidsplassen-react";
import { trackMetrics } from "@/app/_common/actions/metrics";
import { removeUuid } from "@/app/_common/utils/removeUuid";

export default function CookieMetrics(): null {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        let actionValue = "no-action";

        const userActionTaken = getUserActionTakenValue(document.cookie) ?? false;
        const hasCookieConsent: { analyticsConsent: boolean } = getConsentValues(document.cookie);

        if (hasCookieConsent.analyticsConsent) {
            actionValue = "accepted-analytics";
        } else if (userActionTaken && !hasCookieConsent.analyticsConsent) {
            actionValue = "not-accepted-analytics";
        }

        const path = removeUuid(pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ""));

        trackMetrics({
            method: "GET",
            path: path,
            cookieConsent: actionValue,
        });
    }, [pathname, searchParams]);

    return null;
}
