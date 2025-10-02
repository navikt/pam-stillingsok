type HeaderGetter = Pick<Headers, "get">;

export type ExtractBearerOptions = {
    /** cookie-fallback dersom token legges i en cookie */
    cookieName?: string;
};

/** Escape for bruk i RegExp (for cookie-navn med spesialtegn) */
const escapeRegex = (s: string): string => s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");

/**
 * Hent Bearer-token fra Authorization-headeren, evt. fra cookie.
 * Returnerer `null` hvis ikke funnet.
 */
export function extractBearer(headers: HeaderGetter, opts?: ExtractBearerOptions): string | null {
    const auth = headers.get("authorization");
    if (auth) {
        const match = /^Bearer\s+([^\s].*)$/i.exec(auth);
        if (match?.[1]) {
            return match[1].trim();
        }
    }

    const cookieName = opts?.cookieName;
    if (cookieName) {
        const cookie = headers.get("cookie") ?? "";
        const re = new RegExp(`(?:^|;\\s*)${escapeRegex(cookieName)}=([^;]+)`);
        const match = re.exec(cookie);
        if (match?.[1]) {
            return decodeURIComponent(match[1]);
        }
    }

    return null;
}
