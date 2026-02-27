"use client";

import { RefObject, useEffect, useState } from "react";
import { isSkyraSurveyRendered } from "./skyraDom";

type Params = Readonly<{
    readonly skyraSurveyRef: RefObject<HTMLElement | null>;
    readonly slug: string;
    readonly pollIntervalMs?: number;
    readonly maxWaitMs?: number;
}>;

type Result = Readonly<{
    readonly isLoading: boolean;
}>;

export const useSkyraInlineLoading = ({
    skyraSurveyRef,
    slug,
    pollIntervalMs = 150,
    maxWaitMs = 8000,
}: Params): Result => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        let isCancelled = false;
        setIsLoading(true);

        const startedAt = Date.now();

        const tick = () => {
            if (isCancelled) {
                return;
            }

            if (isSkyraSurveyRendered(skyraSurveyRef.current)) {
                setIsLoading(false);
                return;
            }

            const elapsedMs = Date.now() - startedAt;
            if (elapsedMs >= maxWaitMs) {
                // hvis Skyra ikke har rendret, antar vi at den ikke kommer til å gjøre det,
                // og fjerner loaderen setIsLoading(false);
                return;
            }

            window.setTimeout(tick, pollIntervalMs);
        };

        tick();

        return () => {
            isCancelled = true;
        };
    }, [slug, skyraSurveyRef, pollIntervalMs, maxWaitMs]);

    return { isLoading };
};
