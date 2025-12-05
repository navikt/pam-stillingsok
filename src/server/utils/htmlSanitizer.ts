import sanitizeHtmlLib from "sanitize-html";

const allowedTags = [
    "section",
    "article",
    "header",
    "footer",
    "nav",
    "div",
    "span",
    "p",
    "br",
    "ul",
    "ol",
    "li",
    "strong",
    "em",
    "b",
    "i",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "a",
] as const;

const allowedAttributes: Readonly<Record<string, string[]>> = {
    a: ["href", "title", "target", "rel"],
    "*": ["class"],
};

export type SanitizedHtml = string;
// Teste ut DomPurify vs sanitize-html
export function sanitizeHtml(html: string): SanitizedHtml {
    return sanitizeHtmlLib(html, {
        allowedTags: [...allowedTags],
        allowedAttributes,
        // Streng på lenke-skjema:
        allowedSchemes: ["http", "https", "mailto"],
        allowProtocolRelative: false,
    });
}
