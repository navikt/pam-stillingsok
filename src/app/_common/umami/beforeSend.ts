export const BEFORE_SEND_FN_NAME = "navBeforeSend" as const;

type Payload = Record<string, unknown>;

/**
 * Installerer window.navBeforeSend slik at Umami kan kalle den før hver hendelse sendes.
 *
 * Logikk:
 * - Ruter der UUID er innholds-ID (stilling): behold UUID i URL-feltet
 * - `preservedKeys` (website, data, api_key, device_id): aldri redakter
 * - Alle andre felter og ruter: rediger UUID til [uuid]
 *
 * Eksportert som funksjon så logikken er testbar direkte uten eval.
 * Serialisert til BEFORE_SEND_SCRIPT via .toString() for bruk som inline-script.
 *
 * Viktig: funksjonen må være selvinneholdt — ingen referanser til variabler
 * utenfor funksjonen, siden .toString() kun serialiserer funksjonskroppen.
 */
export function installNavBeforeSend(): void {
    const ALLOWED = ["/stillinger/stilling/", "/stillinger/trekk-soknad/", "/stillinger/rapporter-annonse/"];
    // api_key, device_id, website: standard Umami-interne felt
    // data: developer-kontrollerte custom event-data — satt eksplisitt av appen
    const preservedKeys = new Set(["api_key", "device_id", "website", "data"]);
    const uuidPattern = /(^|[^0-9a-f])([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})([^0-9a-f]|$)/gi;

    function redact(v: unknown, key?: string): unknown {
        if (key !== undefined && preservedKeys.has(key)) {
            return v;
        }
        if (typeof v === "string") {
            return v.replace(uuidPattern, "$1[uuid]$3");
        }
        if (Array.isArray(v)) {
            return v.map((item) => redact(item));
        }
        if (v !== null && typeof v === "object") {
            const result: Payload = {};
            for (const [k, val] of Object.entries(v as Payload)) {
                result[k] = redact(val, k);
            }
            return result;
        }
        return v;
    }

    function isAllowedUrl(url: string): boolean {
        try {
            const { pathname } = new URL(url, location.href);
            return ALLOWED.some((p) => pathname.startsWith(p));
        } catch {
            return false;
        }
    }

    (window as unknown as Record<string, unknown>).navBeforeSend = (_type: string, payload: Payload): Payload => {
        const result: Payload = {};
        for (const [k, v] of Object.entries(payload)) {
            result[k] = preservedKeys.has(k) ? v : typeof v === "string" && isAllowedUrl(v) ? v : redact(v, k);
        }
        return result;
    };
}

/**
 * Serialisert versjon av installNavBeforeSend for bruk som inline <Script>-tag.
 * Generert automatisk fra funksjonen over — rediger aldri denne strengen direkte.
 */
export const BEFORE_SEND_SCRIPT = `(${installNavBeforeSend.toString()})()`;
