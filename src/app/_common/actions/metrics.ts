"use server";

import { httpRequests } from "@/metrics";

type MetricsData = {
    method: string;
    path: string;
    cookieConsent: string;
};

export async function trackMetrics(data: MetricsData) {
    try {
        httpRequests.inc({
            method: data.method,
            path: data.path,
            cookieConsent: data.cookieConsent,
        });
    } catch (error) {
        console.error("Error recording metric:", error);
    }
}
