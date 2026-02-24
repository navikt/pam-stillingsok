import { NextRequest } from "next/server";
import { appLogger } from "@/app/_common/logging/appLogger";
import {
    createAuthorizationAndContentTypeHeaders,
    CSRF_COOKIE_NAME,
    exchangeToken,
    type ExchangeTokenResult,
} from "@/app/min-side/_common/auth/auth.server";

export const runtime = "nodejs";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type NodeDuplexRequestInit = RequestInit & { duplex?: "half" };

function requiredEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required env: ${name}`);
    }
    return value;
}

function getUserUrl(): string {
    const baseUrl = requiredEnv("PAMADUSER_URL").replace(/\/+$/, "");
    return `${baseUrl}/api/v1/user`;
}

function getCsrfFromCookies(request: NextRequest): string {
    return request.cookies.get(CSRF_COOKIE_NAME)?.value ?? "";
}

async function getExchangedTokenOrReturn(
    exchanged: ExchangeTokenResult,
): Promise<Readonly<{ ok: true; token: string }> | Readonly<{ ok: false; response: Response }>> {
    if (!exchanged.ok) {
        return { ok: false, response: exchanged.response };
    }
    return { ok: true, token: exchanged.token };
}

async function proxyUser(request: NextRequest, method: HttpMethod): Promise<Response> {
    const exchanged = await exchangeToken(request);
    const exchangedResult = await getExchangedTokenOrReturn(exchanged);

    if (!exchangedResult.ok) {
        return exchangedResult.response;
    }

    const csrf = getCsrfFromCookies(request);
    const headers = createAuthorizationAndContentTypeHeaders(exchangedResult.token, csrf);

    const userUrl = getUserUrl();

    const init: NodeDuplexRequestInit = {
        method,
        headers,
        cache: "no-store",
    };

    const hasBody = method === "POST" || method === "PUT";
    if (hasBody) {
        init.body = request.body;
        init.credentials = "same-origin";
        init.duplex = "half";
    }

    try {
        const upstreamResponse = await fetch(userUrl, init);

        const contentType = upstreamResponse.headers.get("content-type") ?? "application/json";

        if (!upstreamResponse.ok) {
            if (upstreamResponse.status === 404) {
                // GET: 404 betyr "ingen samtykke/ingen ressurs" (UI trenger vite det)
                if (method === "GET") {
                    return new Response(null, { status: 404 });
                }

                // DELETE: idempotent – allerede borte => OK
                if (method === "DELETE") {
                    return new Response(null, { status: 204 });
                }

                // POST/PUT: her er 404 ofte reell feil, behold 404
                return new Response(null, { status: 404 });
            }
            const upstreamText = await upstreamResponse.text();

            if (upstreamResponse.status !== 404) {
                appLogger.httpError(`${method} user feilet status`, {
                    method,
                    url: upstreamResponse.url,
                    status: upstreamResponse.status,
                    statusText: upstreamText,
                });
            }

            return new Response(upstreamText || "En feil skjedde", {
                status: upstreamResponse.status,
                headers: { "content-type": contentType },
            });
        }

        return new Response(upstreamResponse.body, {
            status: upstreamResponse.status,
            headers: { "content-type": contentType },
        });
    } catch (error) {
        appLogger.errorWithCause(`${method} user fetch feilet`, error);
        return new Response("Fetch feilet", { status: 500 });
    }
}

export async function GET(request: NextRequest): Promise<Response> {
    appLogger.info("GET user");
    return proxyUser(request, "GET");
}

export async function POST(request: NextRequest): Promise<Response> {
    appLogger.info("POST user");
    return proxyUser(request, "POST");
}

export async function PUT(request: NextRequest): Promise<Response> {
    appLogger.info("PUT user");
    return proxyUser(request, "PUT");
}

export async function DELETE(request: NextRequest): Promise<Response> {
    appLogger.info("DELETE user");
    return proxyUser(request, "DELETE");
}
