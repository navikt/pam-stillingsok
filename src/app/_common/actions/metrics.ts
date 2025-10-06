"use server";

import { httpRequests } from "@/metrics";

type MetricsData = {
    method: string;
    path: string;
    cookieConsent: string;
};

export async function trackMetrics(data: MetricsData) {
    try {
        console.log("Recording metric:", data);
        httpRequests.inc({
            method: data.method,
            path: data.path,
            cookieConsent: data.cookieConsent,
        });
        console.log("DONE recording metric:", data);
    } catch (error) {
        console.error("Error recording metric:", error);
    }
}
