"use client";

interface UmamiTrackingData {
    [key: string]: string;
}

export function umamiTracking(name: string, data?: UmamiTrackingData) {
    const hostname = window.location.hostname;
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    const language = navigator.language;
    const title = encodeURIComponent(document.title);
    const url = window.location.pathname;
    const referrer = document.referrer || window.location.href;

    navigator.sendBeacon(
        "https://umami.nav.no/api/send",
        JSON.stringify({
            type: "event",
            payload: {
                website: "1cc70e4f-bb41-4d28-8115-cbbc32bee4d3",
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
