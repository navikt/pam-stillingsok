import "server-only";
import DOMPurify from "isomorphic-dompurify";
import type { SanitizedHtml } from "@/server/utils/htmlSanitizer";

const ALLOWED_TAGS = ["a", "br", "em", "li", "ol", "p", "strong", "ul"];
const ALLOWED_ATTRIBUTES = ["href", "title"];
const ALLOWED_URI_PATTERN = /^(?:(?:https):|\/(?!\/)|#)/i;

export function sanitizeSharedContentHtml(dirtyHtml: string): SanitizedHtml {
    return DOMPurify.sanitize(dirtyHtml, {
        ALLOWED_TAGS,
        ALLOWED_ATTR: ALLOWED_ATTRIBUTES,
        ALLOWED_URI_REGEXP: ALLOWED_URI_PATTERN,
    }) as SanitizedHtml;
}

// Artikkelbrødtekst kan ha underoverskrifter. h1 er forbeholdt artikkeltittelen.
export function sanitizeSharedContentArticleHtml(dirtyHtml: string): SanitizedHtml {
    return DOMPurify.sanitize(dirtyHtml, {
        ALLOWED_TAGS: [...ALLOWED_TAGS, "h2", "h3"],
        ALLOWED_ATTR: ALLOWED_ATTRIBUTES,
        ALLOWED_URI_REGEXP: ALLOWED_URI_PATTERN,
    }) as SanitizedHtml;
}

export function toPlainText(dirtyHtml: string): string {
    const body = DOMPurify.sanitize(dirtyHtml, { ALLOWED_TAGS: [], ALLOWED_ATTR: [], RETURN_DOM: true });
    return (body.textContent ?? "").replace(/\s+/gu, " ").trim();
}
