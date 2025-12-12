"use server";

import { v4 as uuidv4 } from "uuid";
import logger from "@/app/stillinger/_common/utils/logger";
import { MetricsEvent, SearchResultRating } from "@/types/metrics-types";

const EVENT_NAME_SEARCH_RESULT_RELEVANT: string = "Vurdering - Søkeresultat";

type MetricsData = {
    method: string;
    path: string;
    cookieConsent: string;
};

// Denne sender data til grafana, kan eventuelt slettes hvis BigQuery/Metabase under fungerer bedre.
export async function trackMetrics(data: MetricsData) {
    fetch(`http://localhost:${process.env.PORT}/api/internal/metrics`, {
        method: "POST",
        body: JSON.stringify({ method: data.method, path: data.path, cookieConsent: data.cookieConsent }),
    }).catch((error) => {
        logger.error("Error recording metric:", error);
    });
}

// Event blir sendt til BigQuery
export async function trackSearchResultRating(rating: SearchResultRating) {
    const event: MetricsEvent = {
        eventId: uuidv4(),
        createdAt: new Date(),
        eventName: EVENT_NAME_SEARCH_RESULT_RELEVANT,
        eventData: { search_result_rating: rating },
    };

    logger.info(`Sending rating event: ${JSON.stringify(event)}`);
    fetch(`http://localhost:9051/api/v1/metrics/event`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(event),
    }).catch((error) => {
        logger.error("Error recording search rating metric:", error);
    });
}
