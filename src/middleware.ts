import { NextRequest, NextResponse } from "next/server";
import { getCallId } from "@/app/stillinger/_common/monitoring/callId";
import { NAV_CALL_ID_TAG } from "@/app/stillinger/_common/monitoring/constants";
import { getSessionId, SESSION_ID_TAG } from "@/app/stillinger/_common/monitoring/session";
import { CURRENT_VERSION, migrateSearchParams } from "@/app/stillinger/(sok)/_utils/versioning/searchParamsVersioning";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import { isTokenValidEdge } from "@/app/min-side/_common/auth/isTokenValid.edge";
import { extractBearer } from "@/app/min-side/_common/auth/extractBearer";

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

function addCspHeaders(requestHeaders: Headers, responseHeaders: Headers) {
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
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
            connect-src 'self' https://sentry.gc.nav.no umami.nav.no https://fastapi.nav.no;
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
        fetch(`http://localhost:${process.env.PORT}/api/internal/metrics`, {
            method: "POST",
            body: JSON.stringify({ method: request.method, path: request.nextUrl.pathname }),
        });
    }
}

function buildLoginRedirect(req: NextRequest): URL {
    const to = encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search);
    return new URL(`/oauth2/login?redirect=${to}`, req.url);
}

const applyResponseHeaders = (res: NextResponse, headers: Headers): void => {
    headers.forEach((value, key) => {
        res.headers.set(key, value);
    });
};

export async function middleware(request: NextRequest) {
    // ⬇️  AUTH FØRST: kun for /min-side/*
    if (request.nextUrl.pathname.startsWith("/min-side") && !request.nextUrl.pathname.startsWith("/oauth2")) {
        if (request.method !== "OPTIONS") {
            const token = extractBearer(request.headers);
            if (!token || !(await isTokenValidEdge(token))) {
                return NextResponse.redirect(buildLoginRedirect(request)); // ← returner direkte; ikke muter noe annet etterpå
            }
        }
    }

    const requestHeaders = new Headers(request.headers);
    const responseHeaders = new Headers();

    if (shouldAddCspHeaders(request)) {
        addCspHeaders(requestHeaders, responseHeaders);
    }

    await addCallIdHeader(requestHeaders);

    addSessionIdHeader(requestHeaders);

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

    applyResponseHeaders(response, responseHeaders);

    return response;
}
