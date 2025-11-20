"use client";

import { useEffect } from "react";
import { configureAnalytics } from "@/app/_common/umami";
import googleTranslateWorkaround from "@/app/_common/utils/googleTranslateWorkaround";

export default function AnalyticsInitializer(): null {
    useEffect(() => {
        configureAnalytics();
        googleTranslateWorkaround();
    }, []);

    return null;
}
