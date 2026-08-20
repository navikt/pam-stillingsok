"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { hasSearchBoxBeenUsed } from "./searchBoxUsed";
import { hasSearchExperienceRatingCookie } from "./searchExperienceCookie";

type SurveyState = "idle" | "open" | "dismissed" | "completed";

const DELAY_MS = 2_000;

type UseSearchRatingSurveyOptions = {
    readonly searchBoxRef: React.RefObject<HTMLElement | null>;
    readonly enabled?: boolean;
};

type UseSearchRatingSurveyResult = {
    readonly state: SurveyState;
    readonly open: () => void;
    readonly dismiss: () => void;
    readonly complete: () => void;
};

export function useSearchRatingSurvey({
    searchBoxRef,
    enabled = true,
}: UseSearchRatingSurveyOptions): UseSearchRatingSurveyResult {
    const [state, setState] = useState<SurveyState>("idle");
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        if (hasSearchExperienceRatingCookie()) {
            return;
        }

        const target = searchBoxRef.current;
        if (!target) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (!entry) {
                    return;
                }

                if (!entry.isIntersecting) {
                    // Sjekk om brukeren faktisk har brukt søkefeltet
                    if (!hasSearchBoxBeenUsed()) {
                        return;
                    }

                    if (timerRef.current === null) {
                        timerRef.current = setTimeout(() => {
                            timerRef.current = null;
                            setState((current) => {
                                if (current === "idle") {
                                    return "open";
                                }
                                return current;
                            });
                        }, DELAY_MS);
                    }
                } else {
                    if (timerRef.current !== null) {
                        clearTimeout(timerRef.current);
                        timerRef.current = null;
                    }
                }
            },
            { threshold: 0 },
        );

        observer.observe(target);

        return () => {
            observer.disconnect();
            if (timerRef.current !== null) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [enabled, searchBoxRef]);

    const open = useCallback(() => {
        setState("open");
    }, []);

    const dismiss = useCallback(() => {
        setState("dismissed");
    }, []);

    const complete = useCallback(() => {
        setState("completed");
    }, []);

    return { state, open, dismiss, complete };
}
