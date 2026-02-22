import DOMPurify from "isomorphic-dompurify";

const normalizeWhitespace = (value: string): string => {
    return value.replace(/\s+/g, " ").trim();
};

const decodeBasicEntities = (value: string): string => {
    return value
        .replace(/&nbsp;/gi, " ")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/gi, "&")
        .replace(/\u00A0/g, " ");
};

export const htmlToPlainText = (rawHtml: string | null | undefined): string => {
    const input = rawHtml ?? "";

    if (input.trim().length === 0) {
        return "";
    }

    // Gi tags som representerer linjeskift/avsnitt et mellomrom først,
    // ellers forsvinner de og teksten kan bli uten mellomrom.

    const withBreaks = input.replace(/<\s*br\s*\/?\s*>/gi, " ").replace(/<\/\s*(p|div|li|h[1-6]|tr|td|th)\s*>/gi, " ");

    const stripped = DOMPurify.sanitize(withBreaks, { ALLOWED_TAGS: [], ALLOWED_ATTR: [], KEEP_CONTENT: true });

    return normalizeWhitespace(decodeBasicEntities(stripped));
};
