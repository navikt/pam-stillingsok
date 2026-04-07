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

type QueuedEvent = Readonly<{
    name: string;
    payload?: UmamiPayload;
    timestamp: number;
}>;

const MAX_QUEUE_SIZE = 50;
const MAX_EVENT_AGE_MS = 30_000;
const FLUSH_INTERVAL_MS = 500;

let eventQueue: QueuedEvent[] = [];
let flushTimerId: ReturnType<typeof setInterval> | null = null;

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

/**
 * Sender alle køede events til Umami og tømmer køen.
 * Events som er eldre enn MAX_EVENT_AGE_MS forkastes.
 */
function flushQueue(): void {
    const umamiApi = getUmamiApi();

    if (!umamiApi) {
        // Forkast events som er for gamle, selv om Umami ikke er klar ennå
        const now = Date.now();
        eventQueue = eventQueue.filter((event) => now - event.timestamp < MAX_EVENT_AGE_MS);

        // Stopp polling dersom køen er tom
        if (eventQueue.length === 0) {
            stopFlushTimer();
        }
        return;
    }

    for (const event of eventQueue) {
        if (Date.now() - event.timestamp < MAX_EVENT_AGE_MS) {
            if (event.payload) {
                umamiApi.track(event.name, event.payload);
            } else {
                umamiApi.track(event.name);
            }
        }
    }

    eventQueue = [];
    stopFlushTimer();
}

function startFlushTimer(): void {
    if (flushTimerId !== null) {
        return;
    }

    flushTimerId = setInterval(flushQueue, FLUSH_INTERVAL_MS);
}

function stopFlushTimer(): void {
    if (flushTimerId !== null) {
        clearInterval(flushTimerId);
        flushTimerId = null;
    }
}

function enqueueEvent(name: string, payload?: UmamiPayload): void {
    if (eventQueue.length >= MAX_QUEUE_SIZE) {
        // Fjern eldste event for å gi plass til nye
        eventQueue.shift();
    }

    eventQueue.push({ name, payload, timestamp: Date.now() });
    startFlushTimer();
}

function sendOrEnqueue(name: string, payload?: UmamiPayload): void {
    const umamiApi = getUmamiApi();

    if (umamiApi) {
        // Tøm eventuell kø først, slik at rekkefølgen bevares
        if (eventQueue.length > 0) {
            flushQueue();
        }

        if (payload) {
            umamiApi.track(name, payload);
        } else {
            umamiApi.track(name);
        }
        return;
    }

    enqueueEvent(name, payload);
}

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

    const [name, payload] = args;

    sendOrEnqueue(name, payload);
}
