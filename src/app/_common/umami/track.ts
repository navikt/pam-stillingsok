"use client";

import { getConsentValues } from "@navikt/arbeidsplassen-react";
import type { EventName, EventPayload, OptionalPayloadName, TrackArgsFor } from "./events";
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
type LegacyTrackArgs = readonly [name: LegacyEventName, payload?: LegacyEventPayload];

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

    return getConsentValues().analyticsConsent;
};

export function track<Name extends Exclude<EventName, OptionalPayloadName>>(
    name: Name,
    payload: EventPayload<Name>,
): void;

export function track<Name extends OptionalPayloadName>(name: Name): void;

export function track<Name extends EventName>(...args: TrackArgsFor<Name>): void;

export function track(...args: LegacyTrackArgs): void;

export function track(...args: TrackArgsFor<EventName> | LegacyTrackArgs): void {
    if (!hasAnalyticsConsent()) {
        return;
    }

    const umamiApi = getUmamiApi();

    if (!umamiApi) {
        return;
    }

    const [name, payload] = args as readonly [EventName | LegacyEventName, UmamiPayload | undefined];

    if (payload) {
        umamiApi.track(name, payload);
        return;
    }

    umamiApi.track(name);
}
