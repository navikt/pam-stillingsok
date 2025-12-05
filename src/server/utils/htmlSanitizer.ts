import DOMPurify from "isomorphic-dompurify";

export type SanitizedHtml = string & { readonly __brand: "SanitizedHtml" };

export function sanitizeHtml(dirty: string): SanitizedHtml {
    const clean = DOMPurify.sanitize(dirty);

    return clean as SanitizedHtml;
}
