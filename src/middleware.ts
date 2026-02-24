import { NextRequest, NextResponse } from "next/server";
import { CURRENT_VERSION, migrateSearchParams } from "@/app/stillinger/(sok)/_utils/versioning/searchParamsVersioning";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import { verifyIdPortenJwtWithClaims } from "@/app/min-side/_common/auth/idportenVerifier";
import { extractBearer } from "@/app/min-side/_common/auth/extractBearer";
import { appLogger } from "@/app/_common/logging/appLogger";

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

export const config = {
    matcher: ["/((?!api|_next/|favicon.ico).*)"],
};

export async function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);
    const responseHeaders = new Headers();

    appLogger.info(`middleware kjører for: ${request.nextUrl.pathname}`);
    const isMinSide = request.nextUrl.pathname.startsWith("/min-side");
    const isOauth = request.nextUrl.pathname.startsWith("/oauth2");

    if (isMinSide && !isOauth) {
        if (request.method !== "OPTIONS") {
            appLogger.info(`Autentiserer request for: ${request.nextUrl.pathname}`);
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
