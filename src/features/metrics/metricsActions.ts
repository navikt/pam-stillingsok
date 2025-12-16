"use server";

import { v4 as uuidv4 } from "uuid";
import logger from "@/app/stillinger/_common/utils/logger";
import { MetricsEvent, MetricsEventName, SearchRating } from "@/features/metrics/metrics-types";

const METRICS_URL = process.env.ARBEIDSPLASSEN_METRICS_API_URL;

export async function trackSearchRating(rating: SearchRating) {
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

    if (!METRICS_URL) {
        logger.warn("METRICS_URL is not defined. Skipping metric tracking.");
        return;
    }
    logger.info(`Sending rating event: ${JSON.stringify(event)}`);
    fetch(METRICS_URL, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(event),
    }).catch((error) => {
        logger.error("Error recording search rating metric:", error);
    });
}
