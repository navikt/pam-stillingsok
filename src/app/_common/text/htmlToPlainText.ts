import DOMPurify from "isomorphic-dompurify";
import type { Config } from "dompurify";

const normalizeWhitespace = (value: string): string => {
    return value.replace(/\s+/g, " ").trim();
};

const decodeBasicEntities = (value: string): string => {
    return value
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/g, "'")
        .replace(/\u00A0/g, " ");
};

// Stripp alle tagger, behold tekstinnholdet.
const STRIP_ALL_TAGS_CONFIG: Readonly<Config> = {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
};

export const htmlToPlainText = (rawHtml: string | null | undefined): string => {
    const input = rawHtml ?? "";

    if (input.trim().length === 0) {
        return "";
    }

    // Gi tags som representerer linjeskift/avsnitt et mellomrom først,
    // ellers forsvinner de og teksten kan bli uten mellomrom.
    const withBreaks = input.replace(/<\s*br\s*\/?\s*>/gi, " ").replace(/<\/\s*(p|div|li|h[1-6]|tr|td|th)\s*>/gi, " ");

    const stripped = DOMPurify.sanitize(withBreaks, STRIP_ALL_TAGS_CONFIG);

    return normalizeWhitespace(decodeBasicEntities(stripped));
};
