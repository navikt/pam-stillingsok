import DOMPurify from "isomorphic-dompurify";

export type SanitizedHtml = string & { readonly __brand: "SanitizedHtml" };

export function sanitizeHtml(dirty: string): SanitizedHtml {
    const clean = DOMPurify.sanitize(dirty, {
        USE_PROFILES: { html: true },
    });

    return clean as SanitizedHtml;
}
