"use client";

import { useEffect, useRef } from "react";
import { track } from "@/app/_common/umami/track";
import type { EventName, EventPayload, OptionalPayloadName } from "@/app/_common/umami/events";

type TrackerPayloadEventName = Exclude<EventName, OptionalPayloadName>;

type EngagementMetrics = Readonly<{
    tidTotalMs: number;
    tidAktivMs: number;
}>;

type Exact<Expected, Actual extends Expected> = Actual & {
    readonly [Key in Exclude<keyof Actual, keyof Expected>]: never;
};

type EngagementTimerOptions<N extends TrackerPayloadEventName, P extends EventPayload<N>> = Readonly<{
    eventName: N;
    getPayload: (metrics: EngagementMetrics) => Exact<EventPayload<N>, P>;
    idleAfterMs?: number;
    resetKey: string;
    enabled?: boolean;
}>;

// TODO: Deaktiver denne til ting er stabilt i produksjon
export function useEngagementTimer<const N extends TrackerPayloadEventName, P extends EventPayload<N>>(
    options: EngagementTimerOptions<N, P>,
): void {
    const optionsRef = useRef<EngagementTimerOptions<N, P>>(options);

    useEffect(() => {
        optionsRef.current = options;
    }, [options]);

    const mountStartRef = useRef<number>(0);

    const activeStartRef = useRef<number | null>(null);
    const activeAccumRef = useRef<number>(0);

    const idleTimeoutRef = useRef<number | null>(null);
    const isIdleRef = useRef<boolean>(false);

    const hasFlushedRef = useRef<boolean>(false);

    useEffect(() => {
        const enabled = options.enabled ?? true;
        if (enabled === false) {
            return;
        }
        if (typeof window === "undefined") {
            return;
        }

        const idleAfterMs: number = options.idleAfterMs ?? 30_000;

        const nowMs = (): number => {
            return window.performance.now();
        };

        const isPageVisible = (): boolean => {
            return document.visibilityState === "visible";
        };

        const clearIdleTimeout = (): void => {
            if (idleTimeoutRef.current) {
                window.clearTimeout(idleTimeoutRef.current);
                idleTimeoutRef.current = null;
            }
        };

        const stopActiveSegment = (): void => {
            const activeStart = activeStartRef.current;
            if (activeStart === null) {
                return;
            }

            const end = nowMs();
            activeAccumRef.current = activeAccumRef.current + (end - activeStart);
            activeStartRef.current = null;
        };

        const startActiveSegment = (): void => {
            if (!isPageVisible()) {
                return;
            }
            if (isIdleRef.current) {
                return;
            }
            if (activeStartRef.current !== null) {
                return;
            }

            activeStartRef.current = nowMs();
        };

        const markActive = (): void => {
            isIdleRef.current = false;
            startActiveSegment();

            clearIdleTimeout();
            idleTimeoutRef.current = window.setTimeout(() => {
                isIdleRef.current = true;
                stopActiveSegment();
            }, idleAfterMs);
        };

        const flush = (): void => {
            if (hasFlushedRef.current) {
                return;
            }

            stopActiveSegment();
            clearIdleTimeout();

            const totalMs = nowMs() - mountStartRef.current;
            const activeMs = activeAccumRef.current;

            if (totalMs < 3_000 && activeMs < 1_000) {
                hasFlushedRef.current = true;
                return;
            }

            const current = optionsRef.current;

            const payload = current.getPayload({
                tidTotalMs: Math.round(totalMs),
                tidAktivMs: Math.round(activeMs),
            });

            track(current.eventName, payload);

            hasFlushedRef.current = true;
        };

        // Reset per session
        hasFlushedRef.current = false;
        mountStartRef.current = nowMs();
        activeAccumRef.current = 0;
        activeStartRef.current = null;
        isIdleRef.current = false;

        markActive();

        const onVisibilityChange = (): void => {
            if (isPageVisible()) {
                markActive();
            } else {
                stopActiveSegment();
                clearIdleTimeout();
            }
        };

        const onUserActivity = (): void => {
            markActive();
        };

        const onPageHide = (): void => {
            flush();
        };

        document.addEventListener("visibilitychange", onVisibilityChange);
        window.addEventListener("pagehide", onPageHide);

        window.addEventListener("scroll", onUserActivity, { passive: true });
        window.addEventListener("mousemove", onUserActivity);
        window.addEventListener("keydown", onUserActivity);
        window.addEventListener("touchstart", onUserActivity, { passive: true });

        return () => {
            document.removeEventListener("visibilitychange", onVisibilityChange);
            window.removeEventListener("pagehide", onPageHide);

            window.removeEventListener("scroll", onUserActivity);
            window.removeEventListener("mousemove", onUserActivity);
            window.removeEventListener("keydown", onUserActivity);
            window.removeEventListener("touchstart", onUserActivity);

            flush();
        };
    }, [options.enabled, options.idleAfterMs, options.resetKey]);
}
