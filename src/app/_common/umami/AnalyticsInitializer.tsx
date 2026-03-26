"use client";

import { type ReactElement, useEffect, useState } from "react";
import Script from "next/script";
import { getConsentValues } from "@navikt/arbeidsplassen-react";
import { getUmamiConfig } from "./getUmamiConfig";

type AnalyticsInitializerState = Readonly<{
    hasAnalyticsConsent: boolean;
    websiteId: string | null;
    scriptSrc: string | null;
}>;

const INITIAL_STATE: AnalyticsInitializerState = {
    hasAnalyticsConsent: false,
    websiteId: null,
    scriptSrc: null,
};

export default function AnalyticsInitializer(): ReactElement | null {
    const [state, setState] = useState<AnalyticsInitializerState>(INITIAL_STATE);

    useEffect(() => {
        const consentValues = getConsentValues();
        const umamiConfig = getUmamiConfig();

        setState({
            hasAnalyticsConsent: consentValues.analyticsConsent,
            websiteId: umamiConfig?.websiteId ?? null,
            scriptSrc: umamiConfig?.scriptSrc ?? null,
        });
    }, []);

    if (!state.hasAnalyticsConsent) {
        return null;
    }

    if (!state.websiteId) {
        return null;
    }

    if (!state.scriptSrc) {
        return null;
    }

    return (
        <Script id="nav-umami" src={state.scriptSrc} strategy="afterInteractive" data-website-id={state.websiteId} />
    );
}
