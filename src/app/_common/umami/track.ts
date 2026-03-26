"use client";

import { getConsentValues } from "@navikt/arbeidsplassen-react";
import type { EventName, EventPayload, OptionalPayloadName } from "./events";

type UmamiPayload = Readonly<Record<string, unknown>>;

type UmamiApi = Readonly<{
    track: (name: string, payload?: UmamiPayload) => void;
}>;

const getUmamiApi = (): UmamiApi | null => {
    if (typeof window === "undefined") {
        return null;
    }

    const windowWithUmami = window as typeof window & {
        umami?: UmamiApi;
    };

    return windowWithUmami.umami ?? null;
};

const hasAnalyticsConsent = (): boolean => {
    if (typeof window === "undefined") {
        return false;
    }

    const consentValues = getConsentValues();
    return consentValues.analyticsConsent;
};

/**
 * Pageviews håndteres av det offisielle scriptet.
 * Beholdes kun for bakoverkompatibilitet.
 */
export const trackPageview = (): void => {
    return;
};

export function track<N extends Exclude<EventName, OptionalPayloadName>>(name: N, payload: EventPayload<N>): void;
export function track<N extends OptionalPayloadName>(name: N): void;
export function track(name: string, payload?: UmamiPayload): void;

export function track(name: string, payload?: UmamiPayload): void {
    if (!hasAnalyticsConsent()) {
        return;
    }

    const umamiApi = getUmamiApi();

    if (!umamiApi) {
        return;
    }

    if (payload) {
        umamiApi.track(name, payload);
        return;
    }

    umamiApi.track(name);
}
