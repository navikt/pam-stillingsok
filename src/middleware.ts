import { NextRequest, NextResponse } from "next/server";
import { getCallId } from "@/app/stillinger/_common/monitoring/callId";
import { NAV_CALL_ID_TAG } from "@/app/stillinger/_common/monitoring/constants";
import { getSessionId, SESSION_ID_TAG } from "@/app/stillinger/_common/monitoring/session";
import { CURRENT_VERSION, migrateSearchParams } from "@/app/stillinger/(sok)/_utils/versioning/searchParamsVersioning";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import { verifyIdPortenJwtWithClaims } from "@/app/min-side/_common/auth/idportenVerifier";
import { extractBearer } from "@/app/min-side/_common/auth/extractBearer";
import { getConsentValues, getUserActionTakenValue } from "@navikt/arbeidsplassen-react";

/*
 * Match all request paths except for the ones starting with:
 * - api (API routes)
 * - _next/static (static files)
 * - favicon.ico (favicon file)
 * Source: https://nextjs.org/docs/pages/guides/content-security-policy
 */
const CSP_HEADER_MATCH = /^\/((?!api|_next\/static|favicon.ico).*)$/;

function shouldAddCspHeaders(request: NextRequest) {
    return new RegExp(CSP_HEADER_MATCH).exec(request.nextUrl.pathname);
}
const makeNonce = (): string => {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    let s = "";
    for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const VARIANT_HEADER = "x-cookie-banner-variant";
type Variant = "A" | "B";

// 50/50 – ingen cookie, ingen persist
function pickVariant(): Variant {
    // Edge-safe random
    const buf = new Uint8Array(1);
    crypto.getRandomValues(buf);
    return (buf[0] & 1) === 0 ? "A" : "B";
}

function addCspHeaders(requestHeaders: Headers, responseHeaders: Headers) {
    const nonce = makeNonce();
    const cspHeader = `
            default-src 'self';
            script-src 'self' 'nonce-${nonce}' 'strict-dynamic' cdn.nav.no ${
                process.env.NODE_ENV === "production" ? "" : `'unsafe-eval'`
            };
            style-src 'self' 'unsafe-inline' https://cdn.nav.no;
            img-src 'self' data https://cdn.nav.no;
            media-src 'none';
            font-src 'self' https://cdn.nav.no;
            object-src 'none';
            base-uri 'none';
            form-action 'self';
            frame-ancestors 'none';
            frame-src 'self' video.qbrick.com;
            block-all-mixed-content;
            ${process.env.NODE_ENV === "production" ? "upgrade-insecure-requests;" : ""};
            connect-src 'self' https://sentry.gc.nav.no umami.nav.no https://fastapi.nav.no https://*.openai.azure.com https://ingest.staging.skyra.no;
    `;

    // Replace newline characters and spaces
    const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, " ").trim();

    requestHeaders.set("x-nonce", nonce);

    responseHeaders.set("Content-Security-Policy", contentSecurityPolicyHeaderValue);
}

async function addCallIdHeader(requestHeaders: Headers) {
    requestHeaders.set(NAV_CALL_ID_TAG, await getCallId());
}

function addSessionIdHeader(requestHeaders: Headers) {
    requestHeaders.set(SESSION_ID_TAG, getSessionId());
}

//const PUBLIC_FILE = /\.(.*)$/;
/**
 * TODO: Fjerne denne utkommenterte koden???? 19.08.2025
 */
// Due to limitations in the edge runtime, we can't use the prom-client library to track metrics directly here.
// See this issue: https://github.com/siimon/prom-client/issues/584
// It's also not possible to switch to a different runtime.
// See this discussion: https://github.com/vercel/next.js/discussions/46722
// eslint-disable-next-line @typescript-eslint/no-unused-vars
/*function collectNumberOfRequestsMetric(request: NextRequest, requestHeaders: Headers) {
    // Don't track requests to js, css, images, etc.
    if (PUBLIC_FILE.test(request.nextUrl.pathname)) {
        return;
    }

    // Sometimes, there are multiple requests for the same page, but we only want to track the first one
    if (requestHeaders.get("next-action") === null) {
        fetch(`http://localhost:${process.env.PORT}/api/internal/metrics`, {
            method: "POST",
            body: JSON.stringify({ method: request.method, path: request.nextUrl.pathname }),
        });
    }
}*/

function trackIfUserAcceptedAnalyticsCookies(request: NextRequest, requestHeaders: Headers) {
    if (
        request.method !== "GET" ||
        request.nextUrl.pathname.startsWith("/_next") ||
        request.nextUrl.pathname.startsWith("/api") ||
        request.nextUrl.pathname.includes(".") ||
        (requestHeaders.get("next-router-prefetch")?.length ?? 0) > 0 ||
        requestHeaders.get("next-action") !== null ||
        requestHeaders.get("x-nextjs-data") === "1" ||
        requestHeaders.get("purpose") === "prefetch"
    ) {
        return;
    }

    const cookieString = requestHeaders.get("cookie") || "";
    let actionValue = "no-action";

    const userActionTaken = getUserActionTakenValue(cookieString);

    const hasCookieConsent: { analyticsConsent: boolean } = getConsentValues(cookieString);

    if (hasCookieConsent.analyticsConsent) {
        actionValue = "accepted-analytics";
    } else if (userActionTaken && !hasCookieConsent.analyticsConsent) {
        actionValue = "not-accepted-analytics";
    }

    if (requestHeaders.get("next-action") === null) {
        fetch(`http://localhost:${process.env.PORT}/api/internal/metrics`, {
            method: "POST",
            body: JSON.stringify({
                cookieConsent: actionValue,
                method: request.method,
                path: request.nextUrl.pathname,
            }),
        });
    }
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

export async function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);
    const responseHeaders = new Headers();

    // --- A/B: bestem variant hvis ikke allerede satt ---
    const incomingVariant = request.headers.get(VARIANT_HEADER);
    const abVariant: Variant = incomingVariant === "A" || incomingVariant === "B" ? incomingVariant : pickVariant();

    // Legg på header på REQUESTEN som sendes videre til appen
    requestHeaders.set(VARIANT_HEADER, abVariant);

    // ⬇️  AUTH FØRST: kun for /min-side/*
    if (request.nextUrl.pathname.startsWith("/min-side") && !request.nextUrl.pathname.startsWith("/oauth2")) {
        if (request.method !== "OPTIONS") {
            const token = extractBearer(request.headers);
            const result = await verifyIdPortenJwtWithClaims(token ?? "");
            if (!result.ok) {
                return NextResponse.redirect(buildLoginRedirect(request));
            }

            // Fjern eventuelle klient-supplerte x-idp-* headere (spoof-sikring)
            ["x-idp-sub", "x-idp-acr", "x-idp-exp", "x-idp-pid"].forEach((header) => requestHeaders.delete(header));

            // Sett verifiserte identitets-headere videre i requesten
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

    if (shouldAddCspHeaders(request)) {
        addCspHeaders(requestHeaders, responseHeaders);
    }

    await addCallIdHeader(requestHeaders);

    addSessionIdHeader(requestHeaders);
    trackIfUserAcceptedAnalyticsCookies(request, requestHeaders);

    // TODO: Fjerne denne utkommenterte koden???? 19.08.2025
    // collectNumberOfRequestsMetric(request, requestHeaders);

    if (
        request.nextUrl.pathname === "/stillinger" &&
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

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    responseHeaders.set(VARIANT_HEADER, abVariant);
    applyResponseHeaders(response, responseHeaders);

    return response;
}
