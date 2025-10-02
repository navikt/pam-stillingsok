import { initTracker, makeEventEnvelope, makePageviewEnvelope, enqueue, reevaluateTracker } from "./client";
import type { TrackerConfig } from "./client";
import type { EventName, EventPayload, OptionalPayloadName } from "./events";

type Globals = {
    getConsentValues: () => { analyticsConsent: boolean }; // alias mot CookieBannerUtils
    getWebsiteId: () => string | undefined | null; // alias mot egen funksjon
};

let getConsentValuesRef: Globals["getConsentValues"] | null = null;
let getWebsiteIdRef: Globals["getWebsiteId"] | null = null;

/**
 * Bind globale funksjoner for samtykke og websiteId.
 * @param getConsentValues
 * @param getWebsiteId
 */
export const bindGlobals = (
    getConsentValues: Globals["getConsentValues"],
    getWebsiteId: Globals["getWebsiteId"],
): void => {
    getConsentValuesRef = getConsentValues;
    getWebsiteIdRef = getWebsiteId;
};

/**
 * Start tracking med gitt endepunkt og opsjoner.
 * @param endpoint
 * @param redact
 * @param debug
 */
export const startTracking = (
    endpoint: string,
    redact?: (d: Record<string, unknown>) => Record<string, unknown>,
    debug?: boolean,
): void => {
    if (!getConsentValuesRef || !getWebsiteIdRef) {
        throw new Error("bindGlobals() må kalles før startTracking()");
    }

    const cfg: TrackerConfig = {
        endpoint,
        getConsent: () => getConsentValuesRef!(),
        getWebsiteId: () => getWebsiteIdRef!(),
        redact,
        debug,
    };

    initTracker(cfg);
};

/** Track a pageview. Kall denne når en "sidevisning" skjer */
export const trackPageview = (): void => {
    if (!getWebsiteIdRef) return;
    const website = getWebsiteIdRef();
    if (!website) return;
    enqueue(makePageviewEnvelope(website));
};

export function track<N extends Exclude<EventName, OptionalPayloadName>>(name: N, payload: EventPayload<N>): void;
export function track<N extends OptionalPayloadName>(name: N): void;

/** Track en event. Payload er optional for events som ikke har data.
 * @param name
 * @param payload
 */
export function track(name: EventName, payload?: Record<string, unknown>): void {
    if (!getWebsiteIdRef) return;
    const website = getWebsiteIdRef();
    if (!website) return;

    const data = payload as unknown as Record<string, unknown>;
    enqueue(makeEventEnvelope(website, name, data));
}

/** Kall denne hvis samtykke/websiteId endres i runtime (f.eks. Cookie-banner klikk) */
export const trackerStateChanged = (): void => {
    reevaluateTracker();
};
