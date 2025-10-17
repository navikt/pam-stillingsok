import DOMPurify from "isomorphic-dompurify";

/** Linkifiserer e-poster i tekstnoder, men rører ikke eksisterende <a>-lenker. */
function adText(html: string): string {
    // Normaliser @-entity
    const decoded = html.replace(/&#64;|&commat;/gi, "@");

    // Beskytt eksisterende <a>...</a> så vi ikke wrap’er på nytt
    const anchors: string[] = [];
    const tokenized = decoded.replace(/<a\b[^>]*>.*?<\/a>/gis, (match) => {
        const token = `__ANCHOR_${anchors.length}__`;
        anchors.push(match);
        return token;
    });

    // Linkify kun i tekstnoder (segmenter mellom >...<)
    const withLinks = tokenized.replace(/(^|>)([^<]+)(?=<|$)/g, (_full, prefix: string, text: string) => {
        const replaced = text.replace(
            /\b([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})\b/gi,
            (m) => `<a rel="nofollow" href="mailto:${m}">${m}</a>`,
        );
        return `${prefix}${replaced}`;
    });

    // sett inn <a>-tags
    let restored = withLinks;
    for (let i = 0; i < anchors.length; i += 1) {
        restored = restored.replace(`__ANCHOR_${i}__`, anchors[i]);
    }

    return restored;
}

/** Sanitiserer annonsetekst og linkifiserer e-postadresser. */
export function sanitizeAdText(html: unknown): string | null {
    if (typeof html !== "string") return null;
    const trimmed = html.trim();
    if (!trimmed) return null;

    const linked = adText(trimmed);
    return DOMPurify.sanitize(linked);
}
