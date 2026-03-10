"use client";

import type { ExperimentKey } from "@/app/_experiments/experiments";
import type { VariantKey } from "@/app/_experiments/types";
import { track } from "@/app/_common/umami";
import { useCallback, useEffect, useRef } from "react";

export type UseAbExposureOnViewParams = Readonly<{
    readonly experiment: ExperimentKey;
    readonly variant: VariantKey;
    /**
     * Nøkkel for å dedupe events i samme session
     * (f.eks. pathname + komponentnavn)
     */
    readonly dedupeKey: string;
    readonly location?: string;

    /**
     * Hvor stor del av elementet må være synlig før vi logger.
     * 0.5 = 50% synlig
     */
    readonly threshold?: number;

    /**
     * Root margin kan brukes for å logge litt før elementet faktisk er i viewport.
     * Eks: "0px 0px -20% 0px"
     */
    readonly rootMargin?: string;
}>;

function makeStorageKey(experiment: ExperimentKey, dedupeKey: string): string {
    return `ab_exposure_viewed:${experiment}:${dedupeKey}`;
}

/**
 * Returnerer en ref-callback du setter på elementet du vil observere.
 */
export function useAbExposureOnView(params: UseAbExposureOnViewParams): (node: Element | null) => void {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const nodeRef = useRef<Element | null>(null);

    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null;
            }
            nodeRef.current = null;
        };
    }, []);

    const handleRef = useCallback(
        (node: Element | null) => {
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null;
            }
            nodeRef.current = node;
            if (!node) {
                return;
            }
            const storageKey = makeStorageKey(params.experiment, params.dedupeKey);
            const alreadySent = sessionStorage.getItem(storageKey);
            if (alreadySent === "1") {
                return;
            }
            const observer = new IntersectionObserver(
                (entries) => {
                    const entry = entries[0];
                    if (!entry) {
                        return;
                    }
                    if (entry.isIntersecting) {
                        sessionStorage.setItem(storageKey, "1");
                        track("AB - eksponering", {
                            experiment: params.experiment,
                            variant: params.variant,
                            location: params.location,
                            type: "viewed",
                        });
                        if (observerRef.current) {
                            observerRef.current.disconnect();
                            observerRef.current = null;
                        } else {
                            observer.disconnect();
                        }
                    }
                },
                {
                    threshold: params.threshold ?? 0.5,
                    rootMargin: params.rootMargin ?? "0px",
                },
            );
            observerRef.current = observer;
            observer.observe(node);
        },
        [params.dedupeKey, params.experiment, params.location, params.rootMargin, params.threshold, params.variant],
    );
    return handleRef;
}
