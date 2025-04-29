"use client";

import { getWebsiteId } from "./getWebsiteId";

export interface UmamiTrackingData {
    [key: string]: string;
}

export function umamiTracking(name: string, data?: UmamiTrackingData) {
    const websiteId = getWebsiteId();
    const hostname = window.location.hostname;
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    const language = navigator.language;
    const title = document.title;
    const url = window.location.pathname;
    const referrer = window.location.href;

    navigator.sendBeacon(
        "https://umami.nav.no/api/send",
        JSON.stringify({
            type: "event",
            payload: {
                website: websiteId,
                hostname: hostname,
                screen: screenResolution,
                language: language,
                title: title,
                url: url,
                referrer: referrer,
                name: name,
                data: data || {},
            },
        }),
    );
}
