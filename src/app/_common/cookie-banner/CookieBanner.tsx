"use client";

import React, { useRef } from "react";
import { useCookieBannerContext } from "@/app/_common/cookie-banner/CookieBannerContext";
import { onConsentChanged, track } from "@/app/_common/umami";
import { CookieBannerB } from "@navikt/arbeidsplassen-react";

export default function CookieBanner() {
    const { closeCookieBanner, showCookieBanner, setShowCookieBanner } = useCookieBannerContext();
    const bannerRef = useRef<HTMLDivElement>(null);

    if (!showCookieBanner) {
        return null;
    }

    return (
        <div ref={bannerRef}>
            <CookieBannerB
                headingLevel="2"
                getUrl={() => window.location.pathname}
                variant="B"
                onAcceptedAllTrack={(payload) => {
                    track("Cookiebanner – Godta alle", payload);
                }}
                onClose={() => {
                    closeCookieBanner();
                    setShowCookieBanner(false);
                    onConsentChanged();
                }}
            />
        </div>
    );
}
