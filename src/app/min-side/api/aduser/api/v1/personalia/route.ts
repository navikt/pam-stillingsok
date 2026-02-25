import { appLogger } from "@/app/_common/logging/appLogger";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { createAuthorizationAndContentTypeHeaders, exchangeToken } from "@/app/min-side/_common/auth/auth.server";
import { NextRequest } from "next/server";
import { requiredEnv } from "@/app/_common/utils/requiredEnv";

export async function GET(request: NextRequest) {
    appLogger.debug("GET personalia");

    const exchanged = await exchangeToken(request);

    if (!exchanged.ok) {
        return exchanged.response;
    }

    const headers = createAuthorizationAndContentTypeHeaders(exchanged.token, null);

    try {
        const res = await fetch(`${requiredEnv("PAMADUSER_URL").replace(/\/+$/, "")}/api/v1/personalia`, {
            credentials: "same-origin",
            method: "GET",
            cache: "no-store",
            headers,
        });

        const contentType = res.headers.get("content-type") ?? "application/json";

        if (!res.ok) {
            const upstreamText = await res.text();

            if (res.status !== 401 && res.status !== 403) {
                appLogger.httpError("GET personalia feilet status", {
                    method: "GET",
                    url: res.url,
                    status: res.status,
                    statusText: upstreamText,
                });
            }

            return new Response(upstreamText || "En feil skjedde", {
                status: res.status,
                headers: { "content-type": contentType },
            });
        }

        return new Response(res.body, {
            status: res.status,
            headers: { "content-type": contentType },
        });
    } catch (error) {
        appLogger.errorWithCause("GET personalia fetch feilet", error);
        return new Response("Fetch feilet", { status: 500 });
    }
}
