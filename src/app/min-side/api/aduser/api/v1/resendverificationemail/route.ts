import { NextRequest } from "next/server";
import { appLogger } from "@/app/_common/logging/appLogger";
import {
    createAuthorizationAndContentTypeHeaders,
    CSRF_COOKIE_NAME,
    exchangeToken,
} from "@/app/min-side/_common/auth/auth.server";

export const runtime = "nodejs";

function requiredEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required env: ${name}`);
    }
    return value;
}

function getResendVerificationUrl(): string {
    const baseUrl = requiredEnv("PAMADUSER_URL").replace(/\/+$/, "");
    return `${baseUrl}/api/v1/user/resend-verification-mail`;
}

export async function PUT(request: NextRequest): Promise<Response> {
    appLogger.info("PUT resendverificationemail");

    const exchanged = await exchangeToken(request);
    if (!exchanged.ok) {
        return exchanged.response;
    }

    const csrf = request.cookies.get(CSRF_COOKIE_NAME)?.value ?? "";
    const headers = createAuthorizationAndContentTypeHeaders(exchanged.token, csrf);

    try {
        const upstreamResponse = await fetch(getResendVerificationUrl(), {
            method: "PUT",
            headers,
            credentials: "same-origin",
            cache: "no-store",
        });

        appLogger.info("PUT resendverificationemail upstream response", { status: upstreamResponse.status });

        const contentType = upstreamResponse.headers.get("content-type") ?? "application/json";

        if (!upstreamResponse.ok) {
            const upstreamText = await upstreamResponse.text();

            appLogger.httpError("PUT resendverificationemail feilet status", {
                method: "PUT",
                url: upstreamResponse.url,
                status: upstreamResponse.status,
                statusText: upstreamText,
            });

            return new Response(upstreamText || "En feil skjedde", {
                status: upstreamResponse.status,
                headers: { "content-type": contentType },
            });
        }

        return Response.json({});
    } catch (error) {
        appLogger.errorWithCause("PUT resendverificationemail fetch feilet", error);
        return new Response("Fetch feilet", { status: 500 });
    }
}
