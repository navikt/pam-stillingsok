"use client";

import { useEffect } from "react";
import { configureAnalytics } from "@/app/_common/umami";

export default function AnalyticsInitializer(): null {
    useEffect(() => {
        configureAnalytics();
    }, []);

    return null;
}
