import React, { useRef } from "react";
import { useCookieBanner } from "@/app/_common/cookie-banner/CookieBannerContext";
import { onConsentChanged, track } from "@/app/_common/umami";
import { CookieBannerA } from "@navikt/arbeidsplassen-react";
import { CookieBannerB } from "@navikt/arbeidsplassen-react";

export default function CookieBanner({ cookieBannerVariant = "A" }: { cookieBannerVariant?: "A" | "B" }) {
    const { closeCookieBanner, showCookieBanner, setShowCookieBanner } = useCookieBanner();
    const bannerRef = useRef<HTMLDivElement>(null);

    if (!showCookieBanner) return null;

    return (
        <div ref={bannerRef}>
            {cookieBannerVariant === "A" && (
                <CookieBannerA
                    headingLevel="2"
                    getUrl={() => window.location.pathname}
                    variant="A"
                    onAcceptedAllTrack={(payload) => {
                        track("Cookiebanner – Godta alle", payload);
                    }}
                    onClose={() => {
                        closeCookieBanner();
                        setShowCookieBanner(false);
                        onConsentChanged();
                    }}
                />
            )}

            {cookieBannerVariant === "B" && (
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
            )}
        </div>
    );
}
