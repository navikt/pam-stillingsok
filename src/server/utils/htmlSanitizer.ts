import { sanitize, removed } from "isomorphic-dompurify";

/**
 * TODO: sjekk om denne fungerer i client, gjør den det, flytt filen til src/app/_common/html
 */
export type SanitizedHtml = string & { readonly __brand: "SanitizedHtml" };

export function sanitizeHtml(dirty: string): SanitizedHtml {
    const clean = sanitize(dirty);

    console.warn(`Removed ${removed.length} tags while stripping HTML:`, removed);

    return clean as SanitizedHtml;
}
