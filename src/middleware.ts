import { NextRequest, NextResponse } from "next/server";
import {
    CURRENT_VERSION,
    migrateSearchParams,
} from "@/app/(nonce)/stillinger/(sok)/_utils/versioning/searchParamsVersioning";
import { QueryNames } from "@/app/(nonce)/stillinger/(sok)/_utils/QueryNames";
import { verifyIdPortenJwtWithClaims } from "@/app/(nonce)/min-side/_common/auth/idportenVerifier";
import { extractBearer } from "@/app/(nonce)/min-side/_common/auth/extractBearer";
import { SKYRA_INLINE_HASH_FALSE, SKYRA_INLINE_HASH_TRUE } from "@/app/_common/skyra/skyraCspHashes.generated";

/**
 * Matcher alle paths bortsett fra statiske assets og API.
 */
export const config = {
    matcher: [
        {
            source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
        },
    ],
};

type CspMode = "nonce" | "static";

const CSP_HEADER_MATCH: RegExp = /^\/((?!api|_next\/static|_next\/image|favicon\.ico).*)$/;

const shouldAddCspHeaders = (pathname: string): boolean => {
    return CSP_HEADER_MATCH.test(pathname);
};

const isPrefetchRequest = (request: NextRequest): boolean => {
    const purpose = request.headers.get("purpose");
    const nextRouterPrefetch = request.headers.get("next-router-prefetch");
    const hasRscQueryParam = request.nextUrl.searchParams.has("_rsc");

    if (purpose === "prefetch") {
        return true;
    }
    if (nextRouterPrefetch === "1") {
        return true;
    }
    if (hasRscQueryParam) {
        return true;
    }

    return false;
};

const makeNonce = (): string => {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);

    let binary = "";
    for (let index = 0; index < bytes.length; index += 1) {
        binary += String.fromCharCode(bytes[index]);
    }

    return btoa(binary);
};

const normalizeHeaderValue = (value: string): string => {
    return value.replace(/\s{2,}/g, " ").trim();
};

const pathHasPrefixSegment = (pathname: string, prefix: string): boolean => {
    if (prefix === "/") {
        return pathname === "/";
    }
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
};

/**
 * ✅ Det er dette som løser "artikler flatt på root":
 * Vi definerer kun NONCE-rutene.
 * Alt annet regnes som "static" CSP.
 */
const NONCE_CSP_PREFIXES: readonly string[] = ["/min-side", "/stillinger"];

/**
 * Hvis du har enkeltruter på root som også skal være nonce (f.eks. "/"),
 * legg dem her:
 */
const NONCE_CSP_EXACT_PATHS = new Set<string>([
    // "/",
]);

const getCspModeForPath = (pathname: string): CspMode => {
    if (NONCE_CSP_EXACT_PATHS.has(pathname)) {
        return "nonce";
    }

    for (const prefix of NONCE_CSP_PREFIXES) {
        if (pathHasPrefixSegment(pathname, prefix)) {
            return "nonce";
        }
    }

    return "static";
};

const buildNonceCsp = (nonce: string, isProduction: boolean): string => {
    const header = `
        default-src 'self';
        script-src 'self' 'nonce-${nonce}' 'strict-dynamic' cdn.nav.no https://survey.skyra.no ${
            isProduction ? "" : "'unsafe-eval'"
        };
        style-src 'self' 'unsafe-inline' https://cdn.nav.no;
        img-src 'self' data: https://cdn.nav.no;
        media-src 'none';
        font-src 'self' https://cdn.nav.no;
        object-src 'none';
        base-uri 'none';
        form-action 'self';
        frame-ancestors 'none';
        frame-src 'self' video.qbrick.com;
        block-all-mixed-content;
        ${isProduction ? "upgrade-insecure-requests;" : ""}
        connect-src 'self' https://sentry.gc.nav.no umami.nav.no https://fastapi.nav.no https://*.openai.azure.com https://ingest.skyra.no https://ingest.staging.skyra.no;
    `;

    return normalizeHeaderValue(header);
};

/**
 * NB:
 * - Uten nonce må du enten (A) tillate inline scripts, eller (B) bruke SRI.
 * - Next.js sin "Without Nonces"-seksjon viser script-src med 'unsafe-inline'. :contentReference[oaicite:1]{index=1}
 * - Alternativt kan dere aktivere SRI (eksperimentelt) for strengere policy på statiske sider. :contentReference[oaicite:2]{index=2}
 */
const buildStaticCsp = (isProduction: boolean): string => {
    const header = `
        default-src 'self';
        script-src 'self'
            'sha256-${SKYRA_INLINE_HASH_FALSE}'
            'sha256-${SKYRA_INLINE_HASH_TRUE}'
            cdn.nav.no https://survey.skyra.no
            ${isProduction ? "" : "'unsafe-eval'"};
        style-src 'self' 'unsafe-inline' https://cdn.nav.no;
        img-src 'self' data: https://cdn.nav.no;
        media-src 'none';
        font-src 'self' https://cdn.nav.no;
        object-src 'none';
        base-uri 'none';
        form-action 'self';
        frame-ancestors 'none';
        frame-src 'self' video.qbrick.com;
        block-all-mixed-content;
        ${isProduction ? "upgrade-insecure-requests;" : ""}
        connect-src 'self' https://sentry.gc.nav.no umami.nav.no https://fastapi.nav.no https://*.openai.azure.com https://ingest.skyra.no https://ingest.staging.skyra.no;
    `;

    return normalizeHeaderValue(header);
};

const addCspHeaders = (args: {
    readonly mode: CspMode;
    readonly isProduction: boolean;
    readonly requestHeaders: Headers;
    readonly responseHeaders: Headers;
}): void => {
    const { mode, isProduction, requestHeaders, responseHeaders } = args;

    if (mode === "nonce") {
        const nonce = makeNonce();
        const cspHeaderValue = buildNonceCsp(nonce, isProduction);

        requestHeaders.set("x-nonce", nonce);
        requestHeaders.set("Content-Security-Policy", cspHeaderValue);
        responseHeaders.set("Content-Security-Policy", cspHeaderValue);

        return;
    }

    const cspHeaderValue = buildStaticCsp(isProduction);
    responseHeaders.set("Content-Security-Policy", cspHeaderValue);
};

function buildLoginRedirect(req: NextRequest): URL {
    const to = encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search);
    return new URL(`/oauth2/login?redirect=${to}`, req.url);
}

const applyResponseHeaders = (res: NextResponse, headers: Headers): void => {
    headers.forEach((value, key) => {
        res.headers.set(key, value);
    });
};

export async function middleware(request: NextRequest): Promise<NextResponse> {
    const requestHeaders = new Headers(request.headers);
    const responseHeaders = new Headers();

    const pathname = request.nextUrl.pathname;
    const isProduction = process.env.NODE_ENV === "production";

    const isPrefetch = isPrefetchRequest(request);

    // ✅ CSP på alle requests (inkl prefetch)
    if (shouldAddCspHeaders(pathname)) {
        const mode = getCspModeForPath(pathname);
        addCspHeaders({ mode, isProduction, requestHeaders, responseHeaders });
    }

    if (!isPrefetch) {
        // ⬇️ AUTH FØRST: kun for /min-side/*
        if (pathname.startsWith("/min-side") && !pathname.startsWith("/oauth2")) {
            if (request.method !== "OPTIONS") {
                const token = extractBearer(request.headers);
                const result = await verifyIdPortenJwtWithClaims(token ?? "");
                if (!result.ok) {
                    return NextResponse.redirect(buildLoginRedirect(request));
                }

                // Fjern eventuelle klient-supplerte x-idp-* headere (spoof-sikring)
                ["x-idp-sub", "x-idp-acr", "x-idp-exp", "x-idp-pid"].forEach((header) => {
                    requestHeaders.delete(header);
                });

                const { sub, acr, exp } = result.claims;

                if (sub) {
                    requestHeaders.set("x-idp-sub", sub);
                }
                if (acr) {
                    requestHeaders.set("x-idp-acr", acr);
                }
                if (typeof exp === "number") {
                    requestHeaders.set("x-idp-exp", String(exp));
                }
            }
        }
    }

    // ⬇️ Versioning redirect: /stillinger?...
    if (
        pathname === "/stillinger" &&
        request.nextUrl.searchParams.size > 0 &&
        request.nextUrl.searchParams.get(QueryNames.URL_VERSION) !== `${CURRENT_VERSION}`
    ) {
        const migratedSearchParams = migrateSearchParams(request.nextUrl.searchParams);

        if (migratedSearchParams.get(QueryNames.URL_VERSION) === `${CURRENT_VERSION}`) {
            const redirectRes = NextResponse.redirect(
                new URL(`/stillinger?${migratedSearchParams.toString()}`, request.url),
            );
            applyResponseHeaders(redirectRes, responseHeaders);
            return redirectRes;
        }
    }

    const response = NextResponse.next({
        request: { headers: requestHeaders },
    });

    applyResponseHeaders(response, responseHeaders);
    return response;
}
