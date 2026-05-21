"use client";

import { CookieBanner as ArbeidsplassenCookieBanner } from "@navikt/arbeidsplassen-react";
import { useRef } from "react";
import { useCookieBannerContext } from "@/app/_common/cookie-banner/CookieBannerContext";
import { onConsentChanged, trackConsentAction } from "@/app/_common/umami";

export default function CookieBanner() {
    const { closeCookieBanner, showCookieBanner, setShowCookieBanner } = useCookieBannerContext();
    const bannerRef = useRef<HTMLDivElement>(null);

    if (!showCookieBanner) {
        return null;
    }

    return (
        <div ref={bannerRef}>
            <ArbeidsplassenCookieBanner
                headingLevel="2"
                getUrl={() => window.location.pathname}
                onAcceptedAllTrack={(payload) => {
                    trackConsentAction("Cookiebanner – Godta alle", payload);
                }}
                onClose={() => {
                    closeCookieBanner();
                    setShowCookieBanner(false);
                    void onConsentChanged();
                }}
            />
        </div>
    );
}
