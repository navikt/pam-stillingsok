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
    | { type: "event"; payload: BaseFields }; // for pageview, Umami leser "event" + basefelter (uten name)

type ConsentValues = {
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
    debug?: boolean; // ekstra logging i dev
};

const queue: RawEnvelope[] = [];
let ready = false;
let cfg: TrackerConfig | null = null;

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

    if ("sendBeacon" in navigator) {
        navigator.sendBeacon(endpoint, body);
    } else {
        void fetch(endpoint, {
            method: "POST",
            credentials: "omit",
            body,
            keepalive: true,
        });
    }
};

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

    // Hvis tingenes tilstand endrer seg senere (samtykke toggles, websiteId settes etc.),
    // kan dere kalle initTracker(cfg!) på nytt, eller eksponere en liten "reevaluate".
};

export const reevaluateTracker = (): void => evaluateReady();

export const enqueue = (env: RawEnvelope): void => {
    console.log("enqueue", env);
    if (!cfg) return; // ikke initialisert
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
        payload: {
            ...base,
            name,
            ...(safeData ? { data: safeData } : {}),
        },
    };
};
