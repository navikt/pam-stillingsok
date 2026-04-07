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

/**
 * Køen eksisterer kun for to tilfeller:
 *  1. Samtykke-eventet selv (trackConsentAction) – selve klikket ER samtykket,
 *     så det er juridisk greit å køe det og sende etter reload.
 *  2. Events sporet rett etter samtykke, men før Umami-scriptet er lastet
 *     (et kort vindu på noen sekunder etter page reload).
 *
 * Vi har IKKE lov til å samle opp vilkårlige events før samtykke og sende dem
 * etterpå – det håndterer sendOrEnqueue() ved å forkaste events uten samtykke.
 */
const MAX_QUEUE_SIZE = 5;
const MAX_EVENT_AGE_MS = 5_000;
const FLUSH_INTERVAL_MS = 1_000;
const QUEUE_STORAGE_KEY = "umami_event_queue";

let eventQueue: QueuedEvent[] = [];
let flushTimerId: ReturnType<typeof setInterval> | null = null;

/**
 * Lagrer køen i sessionStorage slik at den overlever page reload.
 * Kalles kun fra persistPendingEvents() som sikrer at samtykke er gitt.
 */
function persistQueue() {
    try {
        if (eventQueue.length > 0) {
            sessionStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(eventQueue));
        } else {
            sessionStorage.removeItem(QUEUE_STORAGE_KEY);
        }
    } catch {
        // sessionStorage kan være utilgjengelig (privat modus, kvote full osv.)
    }
}

/**
 * Gjenoppretter køen fra sessionStorage etter page reload.
 */
function restoreQueue() {
    try {
        const stored = sessionStorage.getItem(QUEUE_STORAGE_KEY);
        if (!stored) {
            return;
        }

        sessionStorage.removeItem(QUEUE_STORAGE_KEY);

        const parsed: unknown = JSON.parse(stored);
        if (!Array.isArray(parsed)) {
            return;
        }

        const now = Date.now();
        const restoredEvents = parsed.filter(
            (entry): entry is QueuedEvent =>
                typeof entry === "object" &&
                entry !== null &&
                typeof entry.name === "string" &&
                typeof entry.timestamp === "number" &&
                now - entry.timestamp < MAX_EVENT_AGE_MS,
        );

        if (restoredEvents.length > 0) {
            eventQueue.push(...restoredEvents);
            startFlushTimer();
        }
    } catch {
        // Ugyldig JSON eller utilgjengelig storage – ignorer
    }
}

// Gjenopprett eventuelle køede events fra forrige sidelast
if (typeof window !== "undefined") {
    restoreQueue();
}

const getUmamiApi = (): UmamiApi | null => {
    if (typeof window === "undefined") {
        return null;
    }

    const windowWithUmami = window as typeof window & {
        umami?: UmamiApi;
    };

    return windowWithUmami.umami ?? null;
};

const hasAnalyticsConsent = () => {
    if (typeof window === "undefined") {
        return false;
    }

    return getConsentValues().analyticsConsent;
};

/**
 * Sender alle køede events til Umami og tømmer køen.
 * Events som er eldre enn MAX_EVENT_AGE_MS forkastes.
 * Events som ble køet før samtykke ble gitt, forkastes dersom samtykke aldri kom.
 */
function flushQueue() {
    if (!hasAnalyticsConsent()) {
        // Forkast events som er for gamle – samtykke kan fortsatt komme
        const now = Date.now();
        eventQueue = eventQueue.filter((event) => now - event.timestamp < MAX_EVENT_AGE_MS);

        if (eventQueue.length === 0) {
            stopFlushTimer();
        }
        return;
    }

    const umamiApi = getUmamiApi();

    if (!umamiApi) {
        // Samtykke er gitt, men Umami-scriptet er ikke lastet ennå – vent
        const now = Date.now();
        eventQueue = eventQueue.filter((event) => now - event.timestamp < MAX_EVENT_AGE_MS);

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
    persistQueue(); // Rydder opp sessionStorage etter vellykket flush
}

function startFlushTimer() {
    if (flushTimerId !== null) {
        return;
    }

    flushTimerId = setInterval(flushQueue, FLUSH_INTERVAL_MS);
}

function stopFlushTimer() {
    if (flushTimerId !== null) {
        clearInterval(flushTimerId);
        flushTimerId = null;
    }
}

function enqueueEvent(name: string, payload?: UmamiPayload) {
    if (eventQueue.length >= MAX_QUEUE_SIZE) {
        // Fjern eldste event for å gi plass til nye
        eventQueue.shift();
    }

    eventQueue.push({ name, payload, timestamp: Date.now() });
    startFlushTimer();
}

/**
 * Lagrer køen til sessionStorage slik at den overlever en forestående page reload.
 * Skal kun kalles etter at bruker har gitt samtykke (juridisk krav).
 * Brukes av onConsentChanged() før location.reload().
 */
export function persistPendingEvents() {
    if (!hasAnalyticsConsent()) {
        return;
    }
    persistQueue();
}

function sendOrEnqueue(name: string, payload?: UmamiPayload) {
    const canSend = hasAnalyticsConsent();
    const umamiApi = canSend ? getUmamiApi() : null;

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

    if (!canSend) {
        // Ingen samtykke → forkast eventet
        return;
    }

    // Samtykke er gitt, men Umami-scriptet er ikke lastet ennå – legg i kø
    enqueueEvent(name, payload);
}

/**
 * Sporer en samtykkehandling (f.eks. "Godta alle"-klikket).
 * Køes alltid, uavhengig av nåværende consent-tilstand,
 * fordi selve klikket implisitt utgjør samtykket.
 * Persisteres til sessionStorage og sendes etter reload når Umami er klar.
 */
export function trackConsentAction<Name extends EventName>(name: Name, payload: EventPayload<Name>) {
    enqueueEvent(name, payload as UmamiPayload);
}

export function track<Name extends Exclude<EventName, OptionalPayloadName>>(
    name: Name,
    payload: EventPayload<Name>,
): void;
export function track<Name extends OptionalPayloadName>(name: Name): void;
export function track<Name extends EventName>(...args: TrackArgsFor<Name>): void;
export function track(...args: LegacyTrackArgs): void;

export function track(...args: TrackArgsFor<EventName> | LegacyTrackArgs): void {
    const [name, payload] = args;
    sendOrEnqueue(name, payload);
}
