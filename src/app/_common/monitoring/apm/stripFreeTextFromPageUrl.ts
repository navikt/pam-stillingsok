import type { InitOptions } from "@nais/apm";

type BeforeSendHook = NonNullable<InitOptions["beforeSend"]>;

const FREE_TEXT_PARAM = /([?&])q=[^&#\s"'<>]*/g;
export const FREE_TEXT_PLACEHOLDER = "[fritekst]";

// OTLP-spans i trace-payloads ligger ~10 nivåer ned, dypere enn Nais-scrubberens grense på 8.
const MAX_DEPTH = 32;

export function redactFreeText(value: string): string {
    if (!value.includes("q=")) {
        return value;
    }
    return value.replace(FREE_TEXT_PARAM, `$1q=${FREE_TEXT_PLACEHOLDER}`);
}

function isPlainObject(value: object): value is Record<string, unknown> {
    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
}

function redactDeep(value: unknown, depth: number, seen: WeakSet<object>): unknown {
    if (typeof value === "string") {
        return redactFreeText(value);
    }
    if (value === null || typeof value !== "object" || depth >= MAX_DEPTH || seen.has(value)) {
        return value;
    }
    seen.add(value);

    if (Array.isArray(value)) {
        let changed = false;
        const result = value.map((entry) => {
            const redacted = redactDeep(entry, depth + 1, seen);
            changed ||= redacted !== entry;
            return redacted;
        });
        return changed ? result : value;
    }

    if (!isPlainObject(value)) {
        return value;
    }

    let changed = false;
    const result: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value)) {
        const redacted = redactDeep(entry, depth + 1, seen);
        changed ||= redacted !== entry;
        result[key] = redacted;
    }
    return changed ? result : value;
}

/**
 * 🔴 Rød sone (personvern): erstatter verdien til fritekstsøk (`q`) i alle strenger i
 * telemetri-hendelsen (page-URL, navigasjon, ytelse, fetch-hendelser og trace-spans)
 * før den sendes til delt Loki. Nais-scrubberen maskerer fnr, e-post og token, men ikke fritekst.
 */
export const stripFreeTextFromPageUrl: BeforeSendHook = (item) => redactDeep(item, 0, new WeakSet()) as typeof item;
