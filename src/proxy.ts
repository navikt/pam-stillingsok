import { NextRequest, NextResponse } from "next/server";
import { CURRENT_VERSION, migrateSearchParams } from "@/app/stillinger/(sok)/_utils/versioning/searchParamsVersioning";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import { applyAbCookies } from "@/app/_experiments/middlewareAb";
import { getConsentValues } from "@navikt/arbeidsplassen-react";

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        {
            source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
            missing: [
                { type: "header", key: "next-router-prefetch" },
                { type: "header", key: "purpose", value: "prefetch" },
            ],
        },
    ],
};

const makeNonce = (): string => {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);

    let binary = "";
    for (let index = 0; index < bytes.length; index += 1) {
        binary += String.fromCharCode(bytes[index]);
    }

    // Klassisk Base64 med padding, ingen tegnbytte
    return btoa(binary);
};
function addCspHeaders(requestHeaders: Headers, responseHeaders: Headers) {
    const nonce = makeNonce();
    const isProd = process.env.NODE_ENV === "production";
    const cspParts = [
        "default-src 'self';",
        `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' cdn.nav.no https://survey.skyra.no${isProd ? "" : " 'unsafe-eval'"};`,
        "style-src 'self' 'unsafe-inline' https://cdn.nav.no;",
        "img-src 'self' data: https://cdn.nav.no;",
        "media-src 'none';",
        "font-src 'self' https://cdn.nav.no;",
        "object-src 'none';",
        "base-uri 'none';",
        "form-action 'self';",
        "frame-ancestors 'none';",
        "frame-src 'self' video.qbrick.com;",
        "block-all-mixed-content;",
        ...(isProd ? ["upgrade-insecure-requests;"] : []),
        "connect-src 'self' https://sentry.gc.nav.no umami.nav.no https://fastapi.nav.no https://*.openai.azure.com https://ingest.skyra.no https://ingest.staging.skyra.no;",
    ];

    // Replace newline characters and spaces
    const contentSecurityPolicyHeaderValue = cspParts.join(" ");

    requestHeaders.set("x-nonce", nonce);

    responseHeaders.set("Content-Security-Policy", contentSecurityPolicyHeaderValue);
}

function buildLoginRedirect(req: NextRequest): URL {
    const to = encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search);
    return new URL(`/oauth2/login?redirect=${to}`, req.url);
}

const applyResponseHeaders = (res: NextResponse, headers: Headers) => {
    headers.forEach((value, key) => {
        res.headers.set(key, value);
    });
};

function isRscRequest(request: NextRequest): boolean {
    // Next RSC requests: ofte _rsc i query, og/eller RSC-header
    if (request.nextUrl.searchParams.has("_rsc")) {
        return true;
    }
    return request.headers.get("RSC") === "1";
}

function isDocumentLikeRequest(request: NextRequest): boolean {
    const secFetchMode = request.headers.get("sec-fetch-mode");
    if (secFetchMode === "navigate") {
        return true;
    }

    const secFetchDest = request.headers.get("sec-fetch-dest");
    if (secFetchDest === "document") {
        return true;
    }

    const accept = request.headers.get("accept") ?? "";
    return accept.includes("text/html");
}
function hasBearerAuthorization(request: NextRequest): boolean {
    const authorizationHeader = request.headers.get("authorization") ?? "";
    return authorizationHeader.toLowerCase().startsWith("bearer ");
}

function hasAnalyticsConsent(request: NextRequest): boolean {
    const raw = request.headers.get("cookie");
    console.log("Raw consent cookie:", raw);
    const consent = getConsentValues(raw?.toString());
    if (!raw) {
        return false;
    }

    try {
        console.log("Parsed consent cookie:", raw, consent);
        return consent.analyticsConsent;
    } catch {
        return false;
    }
}

export async function proxy(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);
    const responseHeaders = new Headers();

    const isRsc = isRscRequest(request);
    const pathname = request.nextUrl.pathname;
    const isMinSide = pathname.startsWith("/min-side");
    const isOauth = pathname.startsWith("/oauth2");
    if (isMinSide && !isOauth) {
        if (request.method !== "OPTIONS") {
            if (!hasBearerAuthorization(request)) {
                return NextResponse.redirect(buildLoginRedirect(request));
            }
        }
    }

    if (isDocumentLikeRequest(request)) {
        addCspHeaders(requestHeaders, responseHeaders);
    }

    // ikke på _rsc/fetch
    if (
        request.nextUrl.pathname === "/stillinger" &&
        !isRsc &&
        request.nextUrl.searchParams.size > 0 &&
        request.nextUrl.searchParams.get(QueryNames.URL_VERSION) !== `${CURRENT_VERSION}`
    ) {
        const migratedSearchParams = migrateSearchParams(request.nextUrl.searchParams);
        // Should redirect, but only if current version param is set. This is done to prevent a redirect loop
        if (migratedSearchParams.get(QueryNames.URL_VERSION) === `${CURRENT_VERSION}`) {
            const redirectRes = NextResponse.redirect(
                new URL(`/stillinger?${migratedSearchParams.toString()}`, request.url),
            );
            applyResponseHeaders(redirectRes, responseHeaders);

            return redirectRes;
        }
    }
    // Forhindrer indeksering av tilbakemeldinger
    if (pathname.startsWith("/tilbakemeldinger/")) {
        responseHeaders.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    }

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    // ✅ A/B-cookies (kun når samtykke + ikke RSC + document-like)
    applyAbCookies(request, response, {
        hasAnalyticsConsent: hasAnalyticsConsent(request),
        isRsc,
        pathname,
    });

    applyResponseHeaders(response, responseHeaders);

    return response;
}
