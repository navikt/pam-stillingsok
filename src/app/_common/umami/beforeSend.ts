export const BEFORE_SEND_FN_NAME = "navBeforeSend" as const;

type Payload = Record<string, unknown>;

/**
 * Setter opp window.navBeforeSend som Umami kaller før hver event sendes.
 *
 * UUIDs redigeres til [uuid] i alle felt — unntatt:
 * - URL-feltet på stilling/trekk-soknad/rapporter-annonse (UUID er stilling-ID der)
 * - preservedKeys: Umamiinterne felt + "data" (custom event-data vi selv setter)
 *
 * NB: Funksjonen serialiseres med .toString() til et inline-script, så den må
 * være selvinneholdt — ingen closures over variabler utenfor.
 */
export function installNavBeforeSend(): void {
    const ALLOWED_ROUTES = ["/stillinger/stilling/", "/stillinger/trekk-soknad/", "/stillinger/rapporter-annonse/"];
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
            return ALLOWED_ROUTES.some((p) => pathname.startsWith(p));
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
 * Serialisert versjon av installNavBeforeSend — brukes som inline <Script>.
 * Ikke rediger denne strengen direkte, endre funksjonen over.
 */
export const BEFORE_SEND_SCRIPT = `(${installNavBeforeSend.toString()})()`;
