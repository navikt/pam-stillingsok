"use client";

import { useEngagementTimer } from "@/app/_common/tracking/useEngagementTimer";

type ArticleEngagementTrackerProps = Readonly<{
    articleId: string;
    title: string;
    entryPoint: "resultater" | "direkte";
    hasQuiz: boolean;
}>;

export function ArticleEngagementTracker({ articleId, entryPoint, hasQuiz }: ArticleEngagementTrackerProps) {
    useEngagementTimer({
        eventName: "Tid - Enklere vei til jobb-artikkel",
        resetKey: articleId,
        getPayload: ({ tidTotalMs, tidAktivMs }) => ({
            articleId,
            entryPoint,
            hasQuiz,
            tidTotalMs,
            tidAktivMs,
        }),
    });

    return null;
}
