// tracker.ts
import { initTracker, makeEventEnvelope, makePageviewEnvelope, enqueue, reevaluateTracker } from "./client";
import type { TrackerConfig } from "./client";
import type { EventName, EventPayload, OptionalPayloadName } from "./events";

type Globals = {
    getConsentValues: () => { analyticsConsent: boolean };
    getWebsiteId: () => string | undefined | null;
};

let getConsentValuesRef: Globals["getConsentValues"] | null = null;
let getWebsiteIdRef: Globals["getWebsiteId"] | null = null;

export const bindGlobals = (
    getConsentValues: Globals["getConsentValues"],
    getWebsiteId: Globals["getWebsiteId"],
): void => {
    getConsentValuesRef = getConsentValues;
    getWebsiteIdRef = getWebsiteId;
};

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

export const trackPageview = (): void => {
    if (!getWebsiteIdRef) return;
    const website = getWebsiteIdRef();
    if (!website) return;
    enqueue(makePageviewEnvelope(website));
};

export function track<N extends Exclude<EventName, OptionalPayloadName>>(name: N, payload: EventPayload<N>): void;
export function track<N extends OptionalPayloadName>(name: N): void;

export function track(name: EventName, payload?: Record<string, unknown>): void {
    if (!getWebsiteIdRef) return;
    const website = getWebsiteIdRef();
    if (!website) return;
    enqueue(makeEventEnvelope(website, name, payload as Record<string, unknown>));
}

export const trackerStateChanged = (): void => {
    reevaluateTracker();
};
