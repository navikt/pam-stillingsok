"use client";

import { useEffect } from "react";
import { CookieBannerUtils } from "@navikt/arbeidsplassen-react";
import { usePathname, useSearchParams } from "next/navigation";

export default function FastApiTracker(): null {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const trackPageView = async () => {
            try {
                const userActionTaken: boolean = CookieBannerUtils.getUserActionTakenValue(document.cookie);
                const hasCookieConsent: { analyticsConsent: boolean } = CookieBannerUtils.getConsentValues(
                    document.cookie,
                );
                const eventName: string = userActionTaken
                    ? hasCookieConsent.analyticsConsent
                        ? "accepted"
                        : "not-accepted"
                    : "no-action";

                await fetch("/stillinger/api/fastapi", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        url_host: window.location.host,
                        url_path: pathname,
                        url_query: searchParams.toString(),
                        event_name: eventName,
                    }),
                });
            } catch (err) {
                console.error("An error occurred sending event to API route:", err);
            }
        };

        trackPageView();
    }, [pathname]);

    return null;
}
