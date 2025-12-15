"use server";

import { v4 as uuidv4 } from "uuid";
import logger from "@/app/stillinger/_common/utils/logger";
import { MetricsEvent, SearchResultRating } from "@/features/metrics/metrics-types";

export type MetricsEvents = {
    "Vurdering - Sokeresultat": {
        value: "Ja" | "Nei";
    };
    "Valg - Cookie samtykke": {
        action: "no-action" | "accepted-analytics" | "not-accepted-analytics";
    };
};
export type MetricsEventName = keyof MetricsEvents;

export async function trackSearchRating(rating: SearchResultRating) {
    return trackMetrics("Vurdering - Sokeresultat", { value: rating });
}

export async function trackMetrics<Name extends MetricsEventName>(
    eventName: Name,
    eventData: Record<string, string>,
): Promise<void> {
    const event: MetricsEvent = {
        eventId: uuidv4(),
        createdAt: new Date(),
        eventName,
        eventData,
    };

    logger.info(`Sending rating event: ${JSON.stringify(event)}`);
    fetch(process.env.ARBEIDSPLASSEN_METRICS_API_URL || "http://localhost:9051/api/v1/metrics/event", {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(event),
    }).catch((error) => {
        logger.error("Error recording search rating metric:", error);
    });
}
