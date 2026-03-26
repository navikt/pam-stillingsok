"use client";

import { getConsentValues } from "@navikt/arbeidsplassen-react";
import type { EventName, EventPayload, OptionalPayloadName } from "./events";
import {
    DEL_ANNONSE_FACEBOOK,
    DEL_ANNONSE_LINKEDIN,
    DEL_ANNONSE_X,
    KLIKK_ANNONSE,
    KLIKK_LAGRE_FAVORITT,
    KLIKK_MULIGHET,
    KONTAKTER_ARBEIDSGIVER,
    MELD_INTERESSE_TIL_VEILEDER,
    RELEVANTE_SOKETREFF,
    SOKERESULTAT_KLIKK_KARRIEREVEILEDNING,
    SOKERESULTAT_KLIKK_UTDANNING_NO,
    SOMMERJOBB_KLIKK_ANNONSE,
    SOMMERJOBB_KLIKK_KARRIEREVEILEDNING,
} from "@/app/_common/umami/constants";

type UmamiPayload = Readonly<Record<string, unknown>>;

type UmamiApi = Readonly<{
    track: (name: string, payload?: UmamiPayload) => void;
}>;

export type LegacyEventName =
    | typeof MELD_INTERESSE_TIL_VEILEDER
    | typeof SOMMERJOBB_KLIKK_ANNONSE
    | typeof SOMMERJOBB_KLIKK_KARRIEREVEILEDNING
    | typeof RELEVANTE_SOKETREFF
    | typeof SOKERESULTAT_KLIKK_KARRIEREVEILEDNING
    | typeof KLIKK_ANNONSE
    | typeof KLIKK_MULIGHET
    | typeof SOKERESULTAT_KLIKK_UTDANNING_NO
    | typeof KLIKK_LAGRE_FAVORITT
    | typeof KONTAKTER_ARBEIDSGIVER
    | typeof DEL_ANNONSE_FACEBOOK
    | typeof DEL_ANNONSE_LINKEDIN
    | typeof DEL_ANNONSE_X;
export type LegacyEventPayload = Readonly<Record<string, string | number>>;

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

export function track(name: LegacyEventName, payload?: LegacyEventPayload): void;

export function track(name: EventName | LegacyEventName, payload?: UmamiPayload): void {
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
