import React, { useRef } from "react";
import { CookieBanner as ArbeidsplassenCookieBanner } from "@navikt/arbeidsplassen-react";
import { useCookieBanner } from "@/app/_common/cookie-banner/CookieBannerContext";
import { onConsentChanged } from "@/app/_common/umami";

export default function CookieBanner() {
    const { closeCookieBanner, showCookieBanner, setShowCookieBanner } = useCookieBanner();
    const bannerRef = useRef<HTMLDivElement>(null);

    if (!showCookieBanner) return null;

    return (
        <div ref={bannerRef}>
            <ArbeidsplassenCookieBanner
                headingLevel="2"
                bannerRef={bannerRef}
                onClose={() => {
                    closeCookieBanner();
                    setShowCookieBanner(false);
                    onConsentChanged();
                }}
            />
        </div>
    );
}
