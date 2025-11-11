"use server";

import logger from "@/app/stillinger/_common/utils/logger";

type MetricsData = {
    method: string;
    path: string;
    cookieConsent: string;
};

export async function trackMetrics(data: MetricsData) {
    fetch(`http://localhost:${process.env.PORT}/api/internal/metrics`, {
        method: "POST",
        body: JSON.stringify({ method: data.method, path: data.path, cookieConsent: data.cookieConsent }),
    }).catch((error) => {
        logger.error("Error recording metric:", error);
    });
}
