"use client";

import { useEffect } from "react";
import type { ExperimentKey } from "@/app/_experiments/experiments";
import type { VariantKey } from "@/app/_experiments/types";
import { track } from "@/app/_common/umami";

export type UseAbExposureParams = Readonly<{
    readonly experiment: ExperimentKey;
    readonly variant: VariantKey;
    /**
     * Stabil nøkkel for dedupe i session.
     * Eksempel: `${pathname}:HomeSearchJobsCta`
     */
    readonly dedupeKey: string;
    /**
     * forside, hero, footer, header eller pathname for å kunne segmentere på hvor eksponeringen skjedde
     */
    readonly location?: string;
}>;

function makeStorageKey(params: UseAbExposureParams): string {
    return `ab_exposure:${params.experiment}:${params.dedupeKey}`;
}

export function useAbExposure(params: UseAbExposureParams): void {
    useEffect(() => {
        const storageKey = makeStorageKey(params);

        const alreadySent = sessionStorage.getItem(storageKey);
        if (alreadySent === "1") {
            return;
        }

        sessionStorage.setItem(storageKey, "1");

        track("AB - eksponering", {
            experiment: params.experiment,
            variant: params.variant,
            dedupeKey: params.dedupeKey,
            location: params.location,
            type: "rendered",
        });
    }, [params.experiment, params.variant, params.dedupeKey, params.location]);
}
