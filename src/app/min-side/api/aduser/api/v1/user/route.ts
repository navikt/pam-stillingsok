import { appLogger } from "@/app/_common/logging/appLogger";
import {
    createAuthorizationAndContentTypeHeaders,
    CSRF_COOKIE_NAME,
    exchangeTokenOasis,
} from "@/app/min-side/_common/auth/auth.server";
import { NextRequest } from "next/server";
import { requiredEnv } from "@/app/_common/utils/requiredEnv";
import { NodeDuplexRequestInit } from "@/app/stillinger/_common/types/NodeDuplexRequestInit";

const userUrl = `${requiredEnv("PAMADUSER_URL").replace(/\/+$/, "")}/api/v1/user`;

export async function GET(request: NextRequest) {
    request.headers;
    appLogger.debug("GET user");
    const exchanged = await exchangeTokenOasis(request);
    if (!exchanged.ok) {
        return exchanged.response;
    }
    try {
        const res = await fetch(userUrl, {
            method: "GET",
            headers: createAuthorizationAndContentTypeHeaders(exchanged.token, null),
            cache: "no-store",
        });

        const contentType = res.headers.get("content-type") ?? "application/json";

        if (!res.ok) {
            if (res.status === 404) {
                return new Response(null, { status: 404 });
            }

            const text = await res.text();
            appLogger.httpError("GET user feilet status", {
                method: "GET",
                url: res.url,
                status: res.status,
                statusText: text,
            });

            return new Response(text || "En feil skjedde", {
                status: res.status,
                headers: { "content-type": contentType },
            });
        }

        return new Response(res.body, {
            status: res.status,
            headers: { "content-type": contentType },
        });
    } catch (error) {
        appLogger.errorWithCause(`GET user fetch feilet`, error);
        return new Response("Fetch feilet", {
            status: 500,
        });
    }
}

export async function POST(request: NextRequest) {
    appLogger.debug("POST user");

    const exchanged = await exchangeTokenOasis(request);

    if (!exchanged.ok) {
        return exchanged.response;
    }

    try {
        const init: NodeDuplexRequestInit = {
            method: "POST",
            headers: createAuthorizationAndContentTypeHeaders(
                exchanged.token,
                request.cookies.get(CSRF_COOKIE_NAME)?.value,
            ),
            body: request.body,
            credentials: "same-origin",
            duplex: "half",
        };
        const res = await fetch(userUrl, init);
        const contentType = res.headers.get("content-type") ?? "application/json";

        if (!res.ok) {
            const text = await res.text();
            appLogger.httpError(`POST user feilet status`, {
                method: "POST",
                url: res.url,
                status: res.status,
                statusText: text,
            });
            return new Response(text || "En feil skjedde", {
                status: res.status,
                headers: { "content-type": contentType },
            });
        }

        return new Response(res.body, {
            status: res.status,
            headers: { "content-type": contentType },
        });
    } catch (error) {
        appLogger.warnWithCause(`POST user fetch feilet`, error);
        return new Response("Fetch feilet", {
            status: 500,
        });
    }
}

export async function PUT(request: NextRequest) {
    appLogger.info("PUT user");
    const exchanged = await exchangeTokenOasis(request);
    if (!exchanged.ok) {
        return exchanged.response;
    }
    try {
        const init: NodeDuplexRequestInit = {
            method: "PUT",
            headers: createAuthorizationAndContentTypeHeaders(
                exchanged.token,
                request.cookies.get(CSRF_COOKIE_NAME)?.value,
            ),
            body: request.body,
            credentials: "same-origin",
            cache: "no-store",
            duplex: "half",
        };
        const res = await fetch(userUrl, init);

        const contentType = res.headers.get("content-type") ?? "application/json";

        if (!res.ok) {
            const text = await res.text();
            appLogger.httpError(`PUT user feilet status`, {
                method: "PUT",
                url: res.url,
                status: res.status,
                statusText: text,
            });
            return new Response(text || "En feil skjedde", {
                status: res.status,
                headers: { "content-type": contentType },
            });
        }

        return new Response(res.body, {
            status: res.status,
            headers: { "content-type": contentType },
        });
    } catch (error) {
        appLogger.errorWithCause(`PUT user fetch feilet`, error);
        return new Response("Fetch feilet", {
            status: 500,
        });
    }
}

export async function DELETE(request: NextRequest) {
    appLogger.debug("DELETE user");
    const exchanged = await exchangeTokenOasis(request);
    if (!exchanged.ok) {
        return exchanged.response;
    }

    try {
        const res = await fetch(userUrl, {
            method: "DELETE",
            headers: createAuthorizationAndContentTypeHeaders(
                exchanged.token,
                request.cookies.get(CSRF_COOKIE_NAME)?.value,
            ),
            //cache: "no-store",
        });

        if (!res.ok) {
            const text = await res.text();
            appLogger.httpError(`DELETE user feilet status`, {
                method: "DELETE",
                url: res.url,
                status: res.status,
                statusText: text,
            });
            return new Response(text || "En feil skjedde", { status: res.status });
        }
        return new Response(null, { status: 204 });
    } catch (error) {
        appLogger.errorWithCause(`DELETE user fetch feilet`, error);
        return new Response("Fetch feilet", {
            status: 500,
        });
    }
}
