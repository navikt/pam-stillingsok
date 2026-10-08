export type ParsedVimeoHref = Readonly<{ videoId: string; embedSrc: string }>;

/**
 * Trekker ut det numeriske Vimeo-ID-et fra en allerede validert Vimeo-lenke
 * (se isSafeVimeoHref på serversiden) og bygger en lokal embed-URL. Returnerer
 * null for alt som ikke er en kjent, trygg Vimeo-lenkeform – kallere skal da
 * vise en vanlig lenke i stedet for embed.
 *
 * Brukes også til å hente et videoId for sporing uten å lekke hele URL-en.
 */
export function parseVimeoHref(href: string): ParsedVimeoHref | null {
    try {
        const url = new URL(href);
        const pathSegments = url.pathname.split("/").filter(Boolean);

        let videoId: string | undefined;
        if (url.hostname === "vimeo.com" && pathSegments.length === 1) {
            videoId = pathSegments[0];
        } else if (url.hostname === "player.vimeo.com" && pathSegments.length === 2 && pathSegments[0] === "video") {
            videoId = pathSegments[1];
        }

        if (!videoId || !/^\d+$/u.test(videoId)) {
            return null;
        }

        return {
            videoId,
            embedSrc: `https://player.vimeo.com/video/${videoId}?dnt=1&autoplay=1`,
        };
    } catch {
        return null;
    }
}
