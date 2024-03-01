import { NextResponse } from "next/server";
import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import { NAV_CALL_ID_TAG } from "@/app/_common/utils/logger";

export function middleware(request) {
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

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set("Content-Security-Policy", contentSecurityPolicyHeaderValue);

    addCallIdHeader(requestHeaders);

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
    response.headers.set("Content-Security-Policy", contentSecurityPolicyHeaderValue);

    return response;
}

function addCallIdHeader(requestHeaders) {
    const existingCallId = requestHeaders.get(NAV_CALL_ID_TAG);

    if (!uuidValidate(existingCallId)) {
        requestHeaders.set(NAV_CALL_ID_TAG, uuidv4());
    }
}
