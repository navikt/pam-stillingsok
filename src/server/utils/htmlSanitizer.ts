import DOMPurify from "isomorphic-dompurify";

/**
 * TODO: sjekk om denne fungerer i client, gjør den det, flytt filen til src/app/_common/html
 */
export type SanitizedHtml = string & { readonly __brand: "SanitizedHtml" };

export function sanitizeHtml(dirty: string): SanitizedHtml {
    const clean = DOMPurify.sanitize(dirty);

    return clean as SanitizedHtml;
}
