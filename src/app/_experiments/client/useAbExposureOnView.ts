"use client";

import type { ExperimentKey } from "@/app/_experiments/experiments";
import type { VariantKey } from "@/app/_experiments/types";
import { track } from "@/app/_common/umami";

export type UseAbExposureOnViewParams = Readonly<{
    readonly experiment: ExperimentKey;
    readonly variant: VariantKey;
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

function makeStorageKey(params: UseAbExposureOnViewParams): string {
    return `ab_exposure_viewed:${params.experiment}:${params.dedupeKey}`;
}

/**
 * Returnerer en ref-callback du setter på elementet du vil observere.
 */
export function useAbExposureOnView(params: UseAbExposureOnViewParams): (node: Element | null) => void {
    return (node: Element | null) => {
        if (!node) {
            return;
        }

        const storageKey = makeStorageKey(params);
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

                    console.log("logging AB exposure for", {
                        experiment: params.experiment,
                        variant: params.variant,
                        dedupeKey: params.dedupeKey,
                        location: params.location,
                        type: "viewed",
                    });
                    track("AB - eksponering", {
                        experiment: params.experiment,
                        variant: params.variant,
                        dedupeKey: params.dedupeKey,
                        location: params.location,
                        type: "viewed",
                    });

                    observer.disconnect();
                }
            },
            {
                threshold: params.threshold ?? 0.5,
                rootMargin: params.rootMargin ?? "0px",
            },
        );

        observer.observe(node);
    };
}
