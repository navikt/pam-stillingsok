import { NextRequest } from "next/server";
import { appLogger } from "@/app/_common/logging/appLogger";
import { createAuthorizationAndContentTypeHeaders, exchangeToken } from "@/app/min-side/_common/auth/auth.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function requiredEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required env: ${name}`);
    }
    return value;
}

function getPersonaliaUrl(): string {
    const baseUrl = requiredEnv("PAMADUSER_URL").replace(/\/+$/, "");
    return `${baseUrl}/api/v1/personalia`;
}

export async function GET(request: NextRequest): Promise<Response> {
    appLogger.info("GET personalia");

    const exchanged = await exchangeToken(request);

    if (!exchanged.ok) {
        return exchanged.response;
    }

    const personaliaUrl = getPersonaliaUrl();
    const headers = createAuthorizationAndContentTypeHeaders(exchanged.token, null);

    try {
        const upstreamResponse = await fetch(personaliaUrl, {
            method: "GET",
            headers,
            cache: "no-store",
        });

        const contentType = upstreamResponse.headers.get("content-type") ?? "application/json";

        if (!upstreamResponse.ok) {
            const upstreamText = await upstreamResponse.text();

            appLogger.httpError("GET personalia feilet status", {
                method: "GET",
                url: upstreamResponse.url,
                status: upstreamResponse.status,
                statusText: upstreamText,
            });

            return new Response(upstreamText || "En feil skjedde", {
                status: upstreamResponse.status,
                headers: { "content-type": contentType },
            });
        }

        // Unngår å konsumere streamen to ganger: returner body direkte
        return new Response(upstreamResponse.body, {
            status: upstreamResponse.status,
            headers: { "content-type": contentType },
        });
    } catch (error) {
        appLogger.errorWithCause("GET personalia fetch feilet", error);
        return new Response("Fetch feilet", { status: 500 });
    }
}
