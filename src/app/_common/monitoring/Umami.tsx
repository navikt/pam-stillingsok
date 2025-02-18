"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { getCurrentConsent } from "@/app/_common/utils/cookieData";

export default function Umami(): JSX.Element | null {
    const [analyticsDisabled, setAnalyticsDisabled] = useState(false);
    const [isDev, setIsDev] = useState(false);

    useEffect(() => {
        const { consent } = getCurrentConsent();
        setAnalyticsDisabled(!consent.analytics);
    }, []);

    useEffect(() => {
        if (window?.location?.hostname === "arbeidsplassen.intern.dev.nav.no") {
            setIsDev(true);
        }
    }, []);

    if (analyticsDisabled) {
        return null;
    }

    if (!isDev) {
        return null;
    }

    return (
        <Script
            defer
            src="https://cdn.nav.no/team-researchops/sporing/sporing.js"
            data-host-url="https://umami.nav.no"
            data-website-id="1cc70e4f-bb41-4d28-8115-cbbc32bee4d3"
            data-domains="arbeidsplassen.intern.dev.nav.no"
        />
    );
}
