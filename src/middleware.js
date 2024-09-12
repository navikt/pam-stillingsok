import { NextResponse } from "next/server";
import { getCallId, NAV_CALL_ID_TAG } from "@/app/_common/monitoring/callId";
import { getSessionId, SESSION_ID_TAG } from "@/app/_common/monitoring/session";

/*
 * Match all request paths except for the ones starting with:
 * - api (API routes)
 * - _next/static (static files)
 * - favicon.ico (favicon file)
 * Source: https://nextjs.org/docs/pages/building-your-application/configuring/content-security-policy
 */
const CSP_HEADER_MATCH = /^\/((?!api|_next\/static|favicon.ico).*)$/;

function shouldAddCspHeaders(request) {
    return new RegExp(CSP_HEADER_MATCH).exec(request.nextUrl.pathname);
}

function addCspHeaders(requestHeaders, responseHeaders) {
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
    const cspHeader = `
            default-src 'none';
            script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${
                process.env.NODE_ENV === "production" ? "" : `'unsafe-eval'`
            };
            style-src 'self' 'unsafe-inline' https://cdn.nav.no;
            img-src 'self';
            media-src 'none';
            font-src 'self' https://cdn.nav.no;
            object-src 'none';
            base-uri 'none';
            form-action 'self';
            frame-ancestors 'none';
            frame-src 'self';
            block-all-mixed-content;
            upgrade-insecure-requests;
            connect-src 'self' https://amplitude.nav.no https://sentry.gc.nav.no;
    `;

    // Replace newline characters and spaces
    const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, " ").trim();

    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set("Content-Security-Policy", contentSecurityPolicyHeaderValue);

    responseHeaders.set("Content-Security-Policy", contentSecurityPolicyHeaderValue);
}

function addCallIdHeader(requestHeaders) {
    requestHeaders.set(NAV_CALL_ID_TAG, getCallId());
}

function addSessionIdHeader(requestHeaders) {
    requestHeaders.set(SESSION_ID_TAG, getSessionId());
}

const PUBLIC_FILE = /\.(.*)$/;

// Due to limitations in the edge runtime, we can't use the prom-client library to track metrics directly here.
// See this issue: https://github.com/siimon/prom-client/issues/584
// It's also not possible to switch to a different runtime.
// See this discussion: https://github.com/vercel/next.js/discussions/46722
function collectNumberOfRequestsMetric(request, requestHeaders) {
    // Don't track requests to js, css, images, etc.
    if (PUBLIC_FILE.test(request.nextUrl.pathname)) {
        return;
    }

    // Sometimes, there are multiple requests for the same page, but we only want to track the first one
    if (requestHeaders.get("next-action") === null) {
        fetch(`http://127.0.0.1:${process.env.PORT}/stillinger/api/internal/metrics`, {
            method: "POST",
            body: JSON.stringify({ method: request.method, path: request.nextUrl.pathname }),
        });
    }
}

export function middleware(request) {
    const requestHeaders = new Headers(request.headers);
    const responseHeaders = new Headers();

    if (shouldAddCspHeaders(request)) {
        addCspHeaders(requestHeaders, responseHeaders);
    }

    addCallIdHeader(requestHeaders);
    addSessionIdHeader(requestHeaders);

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    responseHeaders.forEach((value, key) => {
        response.headers.set(key, value);
    });

    collectNumberOfRequestsMetric(request, requestHeaders);

    return response;
}
