"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/app/_common/umami/track";
import type { EventName, EventPayload, OptionalPayloadName } from "@/app/_common/umami/events";
import styles from "./ViewportEventTracker.module.css";

type TrackerContext = Readonly<{
    /**
     * Tid mens fanen har vært synlig (ikke total tid siden mount).
     * Dette reduserer "støy" når brukeren åpner siden i en bakgrunnsfane.
     */
    readonly timeOnPageMs: number;
}>;

type BaseProps = Readonly<{
    readonly resetKey: string;
    readonly enabled?: boolean;
    readonly minTimeOnPageMs?: number;
    readonly minVisibleMs?: number;
    readonly threshold?: number;
    readonly rootMargin?: string;
    readonly as?: "span" | "div";
    /**
     * Hvis true: "timeOnPageMs" måles som synlig tid (default).
     * Hvis false: måles som tid siden mount (ikke anbefalt ved mange bakgrunnsfaner).
     */
    readonly measureVisibleTime?: boolean;
}>;

type PropsWithPayload<N extends Exclude<EventName, OptionalPayloadName>> = BaseProps &
    Readonly<{
        readonly eventName: N;
        readonly getPayload: (ctx: TrackerContext) => EventPayload<N>;
    }>;

type PropsWithoutPayload<N extends OptionalPayloadName> = BaseProps &
    Readonly<{
        readonly eventName: N;
        readonly getPayload?: undefined;
    }>;

type AnyWithPayload = {
    [N in Exclude<EventName, OptionalPayloadName>]: PropsWithPayload<N>;
}[Exclude<EventName, OptionalPayloadName>];

type AnyWithoutPayload = PropsWithoutPayload<OptionalPayloadName>;

type ViewportEventTrackerProps = AnyWithPayload | AnyWithoutPayload;

export function ViewportEventTracker<N extends Exclude<EventName, OptionalPayloadName>>(
    props: PropsWithPayload<N>,
): React.ReactNode;
export function ViewportEventTracker<N extends OptionalPayloadName>(props: PropsWithoutPayload<N>): React.ReactNode;

export function ViewportEventTracker(props: ViewportEventTrackerProps): React.ReactNode {
    const pathname = usePathname();

    const sentinelRef = useRef<HTMLElement | null>(null);
    const hasTrackedRef = useRef<boolean>(false);
    const isIntersectingRef = useRef<boolean>(false);

    // Timing: mount + synlig tid
    const mountStartRef = useRef<number>(0);
    const visibleStartRef = useRef<number | null>(null);
    const visibleAccumRef = useRef<number>(0);

    // Timer for "må være synlig i X ms / minst tid på side"
    const timeoutIdRef = useRef<number | null>(null);

    // Unngå at ny inline getPayload fører til re-subscribing
    const propsRef = useRef<ViewportEventTrackerProps>(props);
    useEffect(() => {
        propsRef.current = props;
    }, [props]);

    const {
        resetKey,
        enabled = true,
        minTimeOnPageMs = 9_000,
        minVisibleMs = 100,
        threshold = 0.1,
        rootMargin = "0px",
        as = "span",
        measureVisibleTime = true,
    } = props;

    useEffect(() => {
        if (!enabled) {
            return;
        }
        if (typeof window === "undefined") {
            return;
        }
        if (!("IntersectionObserver" in window)) {
            return;
        }

        hasTrackedRef.current = false;
        isIntersectingRef.current = false;

        mountStartRef.current = window.performance.now();
        visibleAccumRef.current = 0;
        visibleStartRef.current = null;

        const clearTimer = (): void => {
            if (timeoutIdRef.current) {
                window.clearTimeout(timeoutIdRef.current);
                timeoutIdRef.current = null;
            }
        };

        const startVisibleSegment = (): void => {
            if (document.visibilityState !== "visible") {
                return;
            }
            if (visibleStartRef.current !== null) {
                return;
            }
            visibleStartRef.current = window.performance.now();
        };

        const stopVisibleSegment = (): void => {
            const start = visibleStartRef.current;
            if (start === null) {
                return;
            }
            visibleAccumRef.current = visibleAccumRef.current + (window.performance.now() - start);
            visibleStartRef.current = null;
        };

        const getVisibleTimeMs = (): number => {
            const start = visibleStartRef.current;
            if (start === null) {
                return visibleAccumRef.current;
            }
            return visibleAccumRef.current + (window.performance.now() - start);
        };

        const getTimeOnPageMs = (): number => {
            if (measureVisibleTime) {
                return getVisibleTimeMs();
            }
            return window.performance.now() - mountStartRef.current;
        };

        // Start hvis siden allerede er synlig
        startVisibleSegment();

        const onVisibilityChange = (): void => {
            if (document.visibilityState === "visible") {
                startVisibleSegment();

                // Hvis sentinel allerede er i viewport (f.eks. tilbake-navigering), planlegg på nytt
                if (isIntersectingRef.current && !hasTrackedRef.current) {
                    scheduleTrack();
                }
            } else {
                stopVisibleSegment();
                clearTimer();
            }
        };

        const maybeTrack = (): void => {
            if (hasTrackedRef.current) {
                return;
            }
            if (!isIntersectingRef.current) {
                return;
            }
            if (document.visibilityState !== "visible") {
                return;
            }

            const timeOnPageMs = getTimeOnPageMs();
            if (timeOnPageMs < minTimeOnPageMs) {
                return;
            }

            const ctx: TrackerContext = {
                timeOnPageMs,
            };

            const currentProps = propsRef.current;

            if (typeof currentProps.getPayload === "function") {
                track(currentProps.eventName, currentProps.getPayload(ctx));
            } else {
                track(currentProps.eventName);
            }

            hasTrackedRef.current = true;
            clearTimer();
        };

        const scheduleTrack = (): void => {
            clearTimer();

            if (measureVisibleTime && document.visibilityState !== "visible") {
                return;
            }

            const timeOnPageMs = getTimeOnPageMs();
            const remainingMinTimeMs = Math.max(0, minTimeOnPageMs - timeOnPageMs);

            const waitMs = Math.max(minVisibleMs, remainingMinTimeMs);

            timeoutIdRef.current = window.setTimeout(() => {
                timeoutIdRef.current = null;
                maybeTrack();
            }, waitMs);
        };

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                const isIntersecting = Boolean(entry?.isIntersecting);

                isIntersectingRef.current = isIntersecting;

                if (!isIntersecting) {
                    clearTimer();
                    return;
                }

                if (hasTrackedRef.current) {
                    return;
                }

                // Hvis fanen er hidden, vent til den blir visible (visibilitychange vil re-schedule)
                if (measureVisibleTime && document.visibilityState !== "visible") {
                    return;
                }

                scheduleTrack();
            },
            { threshold, rootMargin },
        );

        const target = sentinelRef.current;
        if (target) {
            observer.observe(target);
        }

        document.addEventListener("visibilitychange", onVisibilityChange);

        return () => {
            observer.disconnect();
            document.removeEventListener("visibilitychange", onVisibilityChange);
            stopVisibleSegment();
            clearTimer();
        };
    }, [enabled, measureVisibleTime, minTimeOnPageMs, minVisibleMs, pathname, resetKey, rootMargin, threshold]);

    const setRef = (node: HTMLElement | null): void => {
        sentinelRef.current = node;
    };

    const testId = "viewport-event-tracker-sentinel";
    if (as === "div") {
        return <div ref={setRef} aria-hidden="true" data-testid={testId} className={styles.sentinel} />;
    }

    return <span ref={setRef} aria-hidden="true" data-testid={testId} className={styles.sentinel} />;
}
