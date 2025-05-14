import React, { useContext, useRef } from "react";
import { CookieBanner as ArbeidsplassenCookieBanner } from "@navikt/arbeidsplassen-react";
import CookieBannerContext from "@/app/_common/cookie-banner/CookieBannerContext";

export default function CookieBanner() {
    const { closeCookieBanner, showCookieBanner, setShowCookieBanner } = useContext(CookieBannerContext);
    const bannerRef = useRef(null);

    if (showCookieBanner) {
        return (
            <ArbeidsplassenCookieBanner
                headingLevel="2"
                bannerRef={bannerRef}
                onClose={() => {
                    closeCookieBanner();
                    setShowCookieBanner(false);
                }}
            />
        );
    }

    return null;
}
