"use server";

import { v4 as uuidv4 } from "uuid";
import { MetricsEvent, MetricsEventName, SearchRating } from "@/features/metrics/metrics-types";
import { headers } from "next/headers";
import { appLogger } from "@/app/_common/logging/appLogger";

const METRICS_URL = process.env.ARBEIDSPLASSEN_METRICS_API_URL;

export async function trackSearchRating(rating: SearchRating) {
    return trackMetrics("Vurdering - Sokeresultat", { value: rating });
}

export async function trackMetrics<Name extends MetricsEventName>(
    eventName: Name,
    eventData: Record<string, string>,
): Promise<void> {
    if (!METRICS_URL) {
        appLogger.warn("METRICS_URL is not defined. Skipping metric tracking.");
        return;
    }

    const userAgent = (await headers()).get("user-agent") || "";
    if (
        /googlebot|applebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou|exabot|facebot|ia_archiver/i.test(
            userAgent.toLowerCase(),
        )
    ) {
        return;
    }

    // Add userAgent to eventData
    const event: MetricsEvent = {
        eventId: uuidv4(),
        createdAt: new Date(),
        eventName,
        eventData: {
            ...eventData,
            userAgent,
        },
    };

    try {
        const response = await fetch(METRICS_URL, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify(event),
        });

        if (!response.ok) {
            const text = await response.text();
            appLogger.warn("Metrics endpoint returned non-2xx", {
                status: response.status,
                statusText: text,
            });
        }
    } catch (error) {
        appLogger.errorWithCause("Error recording search rating metric:", error);
    }
}
