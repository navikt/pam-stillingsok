type BaseFields = {
    website: string;
    hostname: string;
    screen: string;
    language: string;
    title: string;
    url: string;
    referrer: string;
};

type RawEnvelope =
    | { type: "event"; payload: BaseFields & { name: string; data?: Record<string, unknown> } }
    | { type: "event"; payload: BaseFields };

export type ConsentValues = {
    analyticsConsent: boolean;
};

type GetConsentFn = () => ConsentValues;
type GetWebsiteIdFn = () => string | undefined | null;
type RedactFn = (incoming: Record<string, unknown>) => Record<string, unknown>;

export type TrackerConfig = {
    endpoint: string;
    getConsent: GetConsentFn;
    getWebsiteId: GetWebsiteIdFn;
    redact?: RedactFn;
    debug?: boolean;
};

const queue: RawEnvelope[] = [];
let ready = false;
let cfg: TrackerConfig | null = null;

const resolveEndpointUrl = (endpoint: string): URL => {
    return new URL(endpoint, window.location.href);
};

const isSameOriginEndpoint = (endpoint: string): boolean => {
    const url = resolveEndpointUrl(endpoint);
    return url.origin === window.location.origin;
};

const buildBaseFields = (website: string): BaseFields => ({
    website,
    hostname: window.location.hostname,
    screen: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language,
    title: document.title,
    url: window.location.href,
    referrer: document.referrer,
});

const sendNow = (endpoint: string, envelope: RawEnvelope): void => {
    const body = JSON.stringify(envelope);
    const sameOrigin = isSameOriginEndpoint(endpoint);

    if (sameOrigin === false && "sendBeacon" in navigator) {
        const ok = navigator.sendBeacon(endpoint, body);
        if (ok) {
            return;
        }
    }
    void fetch(endpoint, {
        method: "POST",
        credentials: "omit",
        body,
        keepalive: true,
        headers: {
            "content-type": "application/json",
        },
    });
};

/** Tøm køen, send alt som ligger der nå.
 * Kalles når vi initieres, og hver gang vi re-evalueres og er "ready".
 */
const flush = (): void => {
    if (!cfg) return;
    const { endpoint, debug } = cfg;
    while (queue.length) {
        const env = queue.shift()!;
        if (debug) {
            console.debug("[umami] flush", env);
        }
        sendNow(endpoint, env);
    }
};

/** Kun analytics: ready når analyticsConsent && websiteId */
const evaluateReady = (): void => {
    if (!cfg) return;
    const { getConsent, getWebsiteId, debug } = cfg;

    const consent = getConsent();
    const website = getWebsiteId();

    ready = Boolean(consent.analyticsConsent && website);
    if (debug) {
        console.debug("[umami] evaluateReady", { consent, website, ready });
    }

    if (ready) flush();
};

export const initTracker = (config: TrackerConfig): void => {
    cfg = config;
    evaluateReady();
};

export const reevaluateTracker = (): void => evaluateReady();

export const enqueue = (env: RawEnvelope): void => {
    if (!cfg) return;
    queue.push(env);
    if (ready) flush();
};

export const makePageviewEnvelope = (website: string): RawEnvelope => ({
    type: "event",
    payload: buildBaseFields(website),
});

export const makeEventEnvelope = (
    website: string,
    name: string,
    data?: Record<string, unknown>,
    redact?: RedactFn,
): RawEnvelope => {
    const base = buildBaseFields(website);
    const safeData = data ? (redact ? redact(data) : data) : undefined;
    return {
        type: "event",
        payload: { ...base, name, ...(safeData ? { data: safeData } : {}) },
    };
};
