import { NextRequest, NextResponse } from "next/server";
import { getCallId, NAV_CALL_ID_TAG } from "@/app/stillinger/_common/monitoring/callId";
import { getSessionId, SESSION_ID_TAG } from "@/app/stillinger/_common/monitoring/session";
import { CURRENT_VERSION, migrateSearchParams } from "@/app/stillinger/(sok)/_utils/versioning/searchParamsVersioning";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import { CookieBannerUtils } from "@navikt/arbeidsplassen-react";

/*
 * Match all request paths except for the ones starting with:
 * - api (API routes)
 * - _next/static (static files)
 * - favicon.ico (favicon file)
 * Source: https://nextjs.org/docs/pages/building-your-application/configuring/content-security-policy
 */
const CSP_HEADER_MATCH = /^\/((?!api|_next\/static|favicon.ico).*)$/;

function shouldAddCspHeaders(request: NextRequest) {
    return new RegExp(CSP_HEADER_MATCH).exec(request.nextUrl.pathname);
}

function addCspHeaders(requestHeaders: Headers, responseHeaders: Headers) {
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
    const cspHeader = `
            default-src 'none';
            script-src 'self' 'nonce-${nonce}' 'strict-dynamic' cdn.nav.no ${
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
            ${process.env.NODE_ENV === "production" ? "upgrade-insecure-requests;" : ""};
            connect-src 'self' https://sentry.gc.nav.no umami.nav.no;
    `;

    // Replace newline characters and spaces
    const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, " ").trim();

    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set("Content-Security-Policy", contentSecurityPolicyHeaderValue);

    responseHeaders.set("Content-Security-Policy", contentSecurityPolicyHeaderValue);
}

function addCallIdHeader(requestHeaders: Headers) {
    requestHeaders.set(NAV_CALL_ID_TAG, getCallId());
}

function addSessionIdHeader(requestHeaders: Headers) {
    requestHeaders.set(SESSION_ID_TAG, getSessionId());
}

const PUBLIC_FILE = /\.(.*)$/;

// Due to limitations in the edge runtime, we can't use the prom-client library to track metrics directly here.
// See this issue: https://github.com/siimon/prom-client/issues/584
// It's also not possible to switch to a different runtime.
// See this discussion: https://github.com/vercel/next.js/discussions/46722
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function collectNumberOfRequestsMetric(request: NextRequest, requestHeaders: Headers) {
    // Don't track requests to js, css, images, etc.
    if (PUBLIC_FILE.test(request.nextUrl.pathname)) {
        return;
    }

    // Sometimes, there are multiple requests for the same page, but we only want to track the first one
    if (requestHeaders.get("next-action") === null) {
        fetch(`http://localhost:${process.env.PORT}/stillinger/api/internal/metrics`, {
            method: "POST",
            body: JSON.stringify({ method: request.method, path: request.nextUrl.pathname }),
        });
    }
}

export function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);
    const responseHeaders = new Headers();

    const pathname = request.nextUrl.pathname;

    if (!/\.[a-zA-Z0-9]+$/.test(pathname)) {
        try {
            const userActionTaken = CookieBannerUtils.getUserActionTakenValue(request.cookies?.toString());
            const hasCookieConsent = CookieBannerUtils.getConsentValues(request.cookies?.toString());
            let eventName = "";

            if (!userActionTaken) {
                eventName = "no-action";
            } else {
                if (hasCookieConsent.analyticsConsent) {
                    eventName = "accepted";
                } else {
                    eventName = "not-accepted";
                }
            }

            // Fire & Forget API Call (Non-blocking) + Log Response
            fetch("https://fastapi.nav.no/api/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    app_id: "501ec40e-4010-4cb4-ad13-61ab529dd765",
                    url_host: request.nextUrl.host,
                    url_path: pathname,
                    url_query: request.nextUrl.search,
                    event_name: eventName,
                }),
            })
                .then((response) => response.text()) // Get response as text
                .then((data) => console.log("Event sent successfully:", data))
                .catch((err) => console.error("Failed to send event:", err));
        } catch (err) {
            console.error("An error occured:", err);
        }
    }

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

    // collectNumberOfRequestsMetric(request, requestHeaders);

    if (
        request.nextUrl.pathname === "/stillinger" &&
        request.nextUrl.searchParams.size > 0 &&
        request.nextUrl.searchParams.get(QueryNames.URL_VERSION) !== `${CURRENT_VERSION}`
    ) {
        const migratedSearchParams = migrateSearchParams(request.nextUrl.searchParams);
        // Should redirect, but only if current version param is set. This is done to prevent a redirect loop
        if (migratedSearchParams.get(QueryNames.URL_VERSION) === `${CURRENT_VERSION}`) {
            return NextResponse.redirect(new URL(`/stillinger?${migratedSearchParams.toString()}`, request.url));
        }
    }

    return response;
}
