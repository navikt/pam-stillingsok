"use client";

import { getConsentValues } from "@navikt/arbeidsplassen-react";
import Script from "next/script";
import { type ReactElement, useEffect, useState } from "react";
import { useCookieBannerContext } from "@/app/_common/cookie-banner/CookieBannerContext";
import { BEFORE_SEND_SCRIPT } from "./beforeSend";
import { getUmamiConfig } from "./getUmamiConfig";

type AnalyticsInitializerProps = Readonly<{
    nonce: string | null;
}>;
type AnalyticsInitializerState = Readonly<{
    hasAnalyticsConsent: boolean;
    websiteId: string | null;
    scriptSrc: string | null;
    hostUrl: string | null;
    optOutFilter: string | null;
    beforeSendFnName: string | null;
}>;

const INITIAL_STATE: AnalyticsInitializerState = {
    hasAnalyticsConsent: false,
    websiteId: null,
    scriptSrc: null,
    hostUrl: null,
    optOutFilter: null,
    beforeSendFnName: null,
};

function readAnalyticsState(): AnalyticsInitializerState {
    const consentValues = getConsentValues();
    const umamiConfig = getUmamiConfig();

    return {
        hasAnalyticsConsent: consentValues.analyticsConsent,
        websiteId: umamiConfig?.websiteId ?? null,
        scriptSrc: umamiConfig?.scriptSrc ?? null,
        hostUrl: umamiConfig?.hostUrl ?? null,
        optOutFilter: umamiConfig?.optOutFilters.join(",") ?? null,
        beforeSendFnName: umamiConfig?.beforeSendFnName ?? null,
    };
}

export default function AnalyticsInitializer({ nonce }: AnalyticsInitializerProps): ReactElement | null {
    const { showCookieBanner } = useCookieBannerContext();
    const [state, setState] = useState<AnalyticsInitializerState>(INITIAL_STATE);

    // Re-evaluerer consent ved mount og når cookiebanneret lukkes (bruker har gjort et valg)
    useEffect(() => {
        setState(readAnalyticsState());
        // TODO: showCookieBanner er trigger for re-evaluering av consent — sørg for at denne oppdateres når bruker endrer valg
    }, [showCookieBanner]);

    if (!state.hasAnalyticsConsent) {
        return null;
    }

    if (!state.websiteId) {
        return null;
    }

    if (!state.scriptSrc) {
        return null;
    }

    if (!state.hostUrl) {
        return null;
    }

    return (
        <>
            <Script id="nav-before-send" strategy="afterInteractive" nonce={nonce ?? undefined}>
                {BEFORE_SEND_SCRIPT}
            </Script>
            <Script
                id="nav-umami"
                src={state.scriptSrc}
                nonce={nonce ?? undefined}
                strategy="afterInteractive"
                data-website-id={state.websiteId}
                data-opt-out-filters={state.optOutFilter}
                data-host-url={state.hostUrl}
                data-before-send={state.beforeSendFnName ?? undefined}
            />
        </>
    );
}
