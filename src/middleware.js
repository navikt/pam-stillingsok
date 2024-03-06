import { NextResponse } from "next/server";
import { getCallId, NAV_CALL_ID_TAG } from "@/app/_common/monitoring/callId";

export function middleware(request) {
    const requestHeaders = new Headers(request.headers);
    const responseHeaders = new Headers();

    if (shouldAddCspHeaders(request)) {
        addCspHeaders(requestHeaders, responseHeaders);
    }

    addCallIdHeader(requestHeaders);

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    responseHeaders.forEach((value, key) => {
        response.headers.set(key, value);
    });

    return response;
}

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
            script-src 'self' 'nonce-${nonce}' ${process.env.NODE_ENV === "production" ? "" : `'unsafe-eval'`};
            style-src 'self' 'unsafe-inline';
            img-src 'self';
            media-src 'none';
            font-src 'self';
            object-src 'none';
            base-uri 'none';
            form-action 'self';
            frame-ancestors 'none';
            frame-src 'self';
            block-all-mixed-content;
            upgrade-insecure-requests;
            connect-src 'self' ${process.env.ARBEIDSPLASSEN_URL} ${
        process.env.INTEREST_API_URL
    } https://amplitude.nav.no https://sentry.gc.nav.no;
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
