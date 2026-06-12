export const BEFORE_SEND_FN_NAME = "navBeforeSend" as const;

type Payload = Record<string, unknown>;

/**
 * Installerer window.navBeforeSend slik at Umami kan kalle den før hver hendelse sendes.
 *
 * Logikk:
 * - Ruter der UUID er innholds-ID (stilling, mulighet): behold UUID i URL-feltet
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
    const UUID_RE = /(^|[^0-9a-f])([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})([^0-9a-f]|$)/gi;

    function redact(v: unknown): unknown {
        UUID_RE.lastIndex = 0;
        if (typeof v === "string") {
            return isAllowedUrl(v) ? v : v.replace(UUID_RE, "$1[uuid]$3");
        }
        if (Array.isArray(v)) {
            return v.map(redact);
        }
        if (v !== null && typeof v === "object") {
            const result: Payload = {};
            for (const [k, val] of Object.entries(v as Payload)) {
                result[k] = redact(val);
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

    // Felter som aldri skal redakteres:
    // - website: Umami sin websiteId (UUID), påkrevd felt
    // - data: developer-kontrollerte custom event-data, satt eksplisitt av appen
    const PASSTHROUGH_FIELDS = ["website", "data"];

    (window as unknown as Record<string, unknown>).navBeforeSend = (_type: string, payload: Payload): Payload => {
        const result: Payload = {};
        for (const [k, v] of Object.entries(payload)) {
            result[k] = PASSTHROUGH_FIELDS.includes(k) ? v : redact(v);
        }
        return result;
    };
}

/**
 * Serialisert versjon av installNavBeforeSend for bruk som inline <Script>-tag.
 * Generert automatisk fra funksjonen over — rediger aldri denne strengen direkte.
 */
export const BEFORE_SEND_SCRIPT = `(${installNavBeforeSend.toString()})()`;
