import { NextResponse } from "next/server";

export function middleware(request) {
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
    const cspHeader = `
    default-src 'none';
    script-src 'self' 'nonce-${nonce}' ${process.env.NODE_ENV === "production" ? "" : `'unsafe-eval'`};
    style-src 'self' ${process.env.NODE_ENV === "production" ? `'nonce-${nonce}'` : `'unsafe-inline'`};
    img-src 'self' data: ;
    media-src 'none';
    font-src 'self' data:;
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

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set("Content-Security-Policy", contentSecurityPolicyHeaderValue);

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
    response.headers.set("Content-Security-Policy", contentSecurityPolicyHeaderValue);

    return response;
}
