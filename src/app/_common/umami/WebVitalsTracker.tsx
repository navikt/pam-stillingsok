"use client";

import { useReportWebVitals } from "next/web-vitals";
import type { NextWebVitalsMetric } from "next/app";
import { umamiTracking } from "@/app/_common/umami/umamiTracking";

function WebVitalsTracker() {
    function reportWebVitals(metric: NextWebVitalsMetric) {
        if (metric.name === "FCP") {
            umamiTracking("Web Vitals", {
                fcp: metric.value,
            });
        }
    }

    useReportWebVitals(reportWebVitals);

    return null;
}

export default WebVitalsTracker;
