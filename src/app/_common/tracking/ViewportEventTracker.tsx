"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/app/_common/umami/track";
import type { EventName, EventPayload, OptionalPayloadName } from "@/app/_common/umami/events";
import styles from "./ViewportEventTracker.module.css";

type TrackerContext = Readonly<{
    readonly pathname: string;
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

// Overloads gir JSX-inferens “et mål” og bevarer koblingen eventName -> payload
export function ViewportEventTracker<N extends Exclude<EventName, OptionalPayloadName>>(
    props: PropsWithPayload<N>,
): React.ReactNode;
export function ViewportEventTracker<N extends OptionalPayloadName>(props: PropsWithoutPayload<N>): React.ReactNode;

export function ViewportEventTracker(props: ViewportEventTrackerProps): React.ReactNode {
    const pathname = usePathname();

    const sentinelRef = useRef<HTMLElement | null>(null);
    const hasTrackedRef = useRef<boolean>(false);
    const isVisibleRef = useRef<boolean>(false);
    const startTimeRef = useRef<number>(0);
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
        minVisibleMs = 500,
        threshold = 0.1,
        rootMargin = "0px",
        as = "span",
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
        isVisibleRef.current = false;
        startTimeRef.current = window.performance.now();

        if (timeoutIdRef.current) {
            window.clearTimeout(timeoutIdRef.current);
            timeoutIdRef.current = null;
        }

        const target = sentinelRef.current;
        if (!target) {
            return;
        }

        const clearTimer = (): void => {
            if (timeoutIdRef.current) {
                window.clearTimeout(timeoutIdRef.current);
                timeoutIdRef.current = null;
            }
        };

        const maybeTrack = (): void => {
            if (hasTrackedRef.current) {
                return;
            }
            if (!isVisibleRef.current) {
                return;
            }

            const timeOnPageMs = window.performance.now() - startTimeRef.current;
            if (timeOnPageMs < minTimeOnPageMs) {
                return;
            }

            const ctx: TrackerContext = {
                pathname,
                timeOnPageMs,
            };

            const currentProps = propsRef.current;

            if (typeof currentProps.getPayload === "function") {
                // Smalner til "med payload"-varianten, og track-overload matcher
                console.log("Tracking event", currentProps.eventName, "with payload", currentProps.getPayload(ctx));
                track(currentProps.eventName, currentProps.getPayload(ctx));
            } else {
                track(currentProps.eventName);
            }

            hasTrackedRef.current = true;
            clearTimer();
        };

        const scheduleTrack = (): void => {
            clearTimer();

            const timeOnPageMs = window.performance.now() - startTimeRef.current;
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

                isVisibleRef.current = isIntersecting;

                if (!isIntersecting) {
                    clearTimer();
                    return;
                }

                if (!hasTrackedRef.current) {
                    scheduleTrack();
                }
            },
            { threshold, rootMargin },
        );

        observer.observe(target);

        return () => {
            observer.disconnect();
            clearTimer();
        };
    }, [enabled, minTimeOnPageMs, minVisibleMs, pathname, resetKey, rootMargin, threshold]);

    const setRef = (node: HTMLElement | null): void => {
        sentinelRef.current = node;
    };

    const testId = "viewport-event-tracker-sentinel";
    if (as === "div") {
        return <div ref={setRef} aria-hidden="true" data-testid={testId} className={styles.sentinel} />;
    }

    return <span ref={setRef} aria-hidden="true" data-testid={testId} className={styles.sentinel} />;
}
