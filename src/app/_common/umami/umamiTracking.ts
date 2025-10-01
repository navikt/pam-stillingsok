"use client";

import { getWebsiteId } from "./getWebsiteId";
import { getConsentValues } from "@navikt/arbeidsplassen-react";

export interface UmamiTrackingData {
    [key: string]: string | number;
}

export function umamiTracking(name?: string, data?: UmamiTrackingData) {
    // Dont track if not agreed
    const consentValues = getConsentValues();
    if (!consentValues.analyticsConsent) {
        return;
    }

    // Dont track if not on dev or prod domain
    const websiteId = getWebsiteId();
    if (!websiteId) {
        return;
    }

    const hostname = window.location.hostname;
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    const language = navigator.language;
    const title = document.title;
    const url = window.location.href;
    const referrer = document.referrer;

    const isPageview = !name && !data;

    const payload = {
        type: "event", // Always "event" type
        payload: {
            website: websiteId,
            hostname: hostname,
            screen: screenResolution,
            language: language,
            title: title,
            url: url,
            referrer: referrer,
            ...(!isPageview && { name }), // Only include name for non-pageview events
            ...(data && { data }), // Only include data if it exists
        },
    };

    if (navigator.sendBeacon) {
        navigator.sendBeacon("https://umami.nav.no/api/send", JSON.stringify(payload));
    } else {
        fetch("https://umami.nav.no/api/send", { method: "POST", body: JSON.stringify(payload), keepalive: true });
    }
}
